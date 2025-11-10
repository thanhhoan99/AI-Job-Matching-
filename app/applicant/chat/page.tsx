"use client"

import type React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Bot, User } from "lucide-react"
import { useEffect, useRef } from "react"

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto scroll xuống cuối khi có message mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const message = formData.get("message") as string
    if (message.trim()) {
      sendMessage({ text: message })
      e.currentTarget.reset()
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Chatbot AI Tư Vấn</h1>
        <p className="text-muted-foreground">
          Trợ lý AI hỗ trợ tư vấn nghề nghiệp 24/7
        </p>
      </div>

      {/* Chat card */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Trợ lý AI
          </CardTitle>
          <CardDescription>
            Hỏi tôi bất cứ điều gì về nghề nghiệp, CV, phỏng vấn...
          </CardDescription>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-hidden p-0">
          <div
            ref={scrollRef}
            className="h-full p-4 space-y-4 overflow-y-auto"
          >
            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm">Một số câu hỏi gợi ý:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        sendMessage({ text: "Làm thế nào để viết CV tốt?" })
                      }
                    >
                      Làm thế nào để viết CV tốt?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        sendMessage({ text: "Chuẩn bị gì cho buổi phỏng vấn?" })
                      }
                    >
                      Chuẩn bị gì cho buổi phỏng vấn?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        sendMessage({
                          text: "Kỹ năng nào quan trọng cho lập trình viên?",
                        })
                      }
                    >
                      Kỹ năng quan trọng cho dev?
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <p key={index} className="whitespace-pre-wrap">
                        {part.text}
                      </p>
                    ) : null
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {(status === "submitted" || status === "streaming") && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              name="message"
              placeholder="Nhập câu hỏi của bạn..."
              disabled={status === "submitted" || status === "streaming"}
              autoComplete="off"
            />
            <Button
              type="submit"
              disabled={status === "submitted" || status === "streaming"}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

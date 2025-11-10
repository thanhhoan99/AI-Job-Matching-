"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Minimize2, Clock } from "lucide-react"
import styles from "./ChatWidget.module.css"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }])

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })

      const reader = res.body?.getReader()
      if (!reader) throw new Error("Không đọc được dữ liệu")

      let content = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = new TextDecoder().decode(value)
        content += chunk
        setMessages(prev =>
          prev.map(m => (m.id === assistantId ? { ...m, content } : m))
        )
      }
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: "❌ Lỗi: Không thể gửi tin nhắn." }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (id: string) =>
    new Date(parseInt(id)).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })

  // Nút mở chat
  if (!isOpen)
    return (
      <div className={styles.fab}>
        <button onClick={() => setIsOpen(true)} className={styles.fabButton}>
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    )

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        {/* Header */}
        <div
          className={styles.chatHeader}
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className={styles.headerLeft}>
            <Bot className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Trợ lý AI</h3>
            <span
              className={`${styles.statusDot} ${
                isLoading ? styles.statusBusy : styles.statusOnline
              }`}
            ></span>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={e => {
                e.stopPropagation()
                setIsMinimized(!isMinimized)
              }}
              className={styles.iconBtn}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                setIsOpen(false)
              }}
              className={styles.iconBtn}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Tin nhắn */}
            <div className={styles.messagesContainer}>
              {messages.length === 0 && (
                <div className={styles.emptyState}>
                  <Bot className="w-6 h-6 text-indigo-500 mb-2" />
                  Xin chào 👋<br />Tôi có thể giúp gì cho bạn?
                </div>
              )}

              {messages.map(m => (
                <div
                  key={m.id}
                  className={`${styles.messageRow} ${
                    m.role === "user" ? styles.userRow : styles.assistantRow
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className={styles.iconBubble}>
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`${styles.messageBubble} ${
                      m.role === "user"
                        ? styles.userBubble
                        : styles.assistantBubble
                    }`}
                  >
                    {m.content}
                    <div className={styles.timestamp}>
                      <Clock className="w-3 h-3" />
                      {formatTime(m.id)}
                    </div>
                  </div>
                  {m.role === "user" && (
                    <div className={styles.iconBubbleGray}>
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className={styles.loadingRow}>
                  <div className={styles.iconBubble}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className={styles.loadingDots}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Ô nhập */}
            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className={styles.input}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={styles.sendButton}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

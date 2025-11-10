"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Download, Printer, Loader2, X } from "lucide-react"
import { generateHTMLFromTemplate } from "@/lib/cv-template"
import styles from "../../styles/PDFPreview.module.css"

interface PDFPreviewProps {
  cvData: any
  template: any
  templateName?: string
  children?: React.ReactNode
}

export function PDFPreview({ cvData, template, templateName, children }: PDFPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print()
    }
  }

  const handleDownload = () => {
    if (iframeRef.current?.contentDocument) {
      const htmlContent = iframeRef.current.contentDocument.documentElement.outerHTML
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `cv-${cvData.personal.full_name}-${templateName || "preview"}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const htmlContent = generateHTMLFromTemplate(cvData, template)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className={styles.previewButton}>
            <Eye className="w-4 h-4 mr-2" />
            Xem trước
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className={`max-w-6xl h-[70vh] flex flex-col ${styles.dialogContent}`}>
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>
            <span className={styles.dialogTitleText}>
              Xem trước CV — {templateName || "Template"}
            </span>

            <div className={styles.toolbar}>
              <Button variant="outline" size="sm" onClick={handleDownload} className={styles.toolbarBtn}>
                <Download className="w-4 h-4 mr-2" />
                HTML
              </Button>

              <Button variant="outline" size="sm" onClick={handlePrint} className={styles.toolbarBtn}>
                <Printer className="w-4 h-4 mr-2" />
                In
              </Button>

              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className={styles.closeBtn}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className={styles.previewWrapper}>
          {isLoading && (
            <div className={styles.loadingOverlay}>
              <Loader2 className={`w-8 h-8 animate-spin ${styles.loadingIcon}`} />
            </div>
          )}
          <iframe
            ref={iframeRef}
            srcDoc={htmlContent}
            className={styles.previewFrame}
            onLoad={() => setIsLoading(false)}
            onLoadStart={() => setIsLoading(true)}
            title="CV Preview"
          />
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Đây là bản xem trước. Khi tải xuống PDF, chất lượng in sẽ cao hơn.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

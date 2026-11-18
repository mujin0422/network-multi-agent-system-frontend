import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

const LEGACY_SECTION_TITLES = new Set([
  "Tóm tắt",
  "Phát hiện chính",
  "Nguyên nhân có khả năng",
  "Hành động đề xuất",
  "Cấu hình đề xuất (chưa thực thi)",
  "Trạng thái dữ liệu",
  "Lỗi thực thi",
])

/** Chuẩn hóa phản hồi cũ sang Markdown mà không làm thay đổi nội dung. */
function normalizeLegacyMarkdown(content: string) {
  const lines = content.split("\n")
  const normalizedLines: string[] = []
  let inConfigurationProposals = false
  let inCommandBlock = false

  const closeCommandBlock = () => {
    if (!inCommandBlock) return

    normalizedLines.push("```")
    inCommandBlock = false
  }

  lines.forEach((line) => {
    const trimmedLine = line.trim()
    const sectionTitle = trimmedLine.replace(/^#{1,6}\s+/, "")

    if (LEGACY_SECTION_TITLES.has(sectionTitle)) {
      closeCommandBlock()
      inConfigurationProposals =
        sectionTitle === "Cấu hình đề xuất (chưa thực thi)"
      normalizedLines.push(`### ${sectionTitle}`)
      return
    }

    if (inConfigurationProposals && trimmedLine.startsWith("• ")) {
      closeCommandBlock()
      const deviceName = trimmedLine.slice(2)
      normalizedLines.push(
        "",
        `#### ${deviceName.toLowerCase().startsWith("thiết bị ") ? deviceName : `Thiết bị ${deviceName}`}`,
        "",
        "```text",
      )
      inCommandBlock = true
      return
    }

    if (inConfigurationProposals && /^Lý do:\s*/i.test(trimmedLine)) {
      closeCommandBlock()
      normalizedLines.push(
        "",
        `> **Lý do:** ${trimmedLine.replace(/^Lý do:\s*/i, "")}`,
      )
      return
    }

    if (inConfigurationProposals && inCommandBlock) {
      if (trimmedLine) normalizedLines.push(trimmedLine)
      return
    }

    if (trimmedLine.startsWith("• ")) {
      normalizedLines.push(
        `${line.slice(0, line.indexOf("•"))}- ${trimmedLine.slice(2)}`,
      )
      return
    }

    normalizedLines.push(line)
  })

  closeCommandBlock()
  return normalizedLines.join("\n")
}

/** Hiển thị Markdown an toàn cho phản hồi của chatbot. */
export function ChatMarkdown({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  return (
    <div className={cn("min-w-0 text-sm leading-7 text-foreground", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-6 text-xl font-semibold tracking-tight first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-5 text-lg font-semibold tracking-tight first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-base font-semibold tracking-tight first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground first:mt-0">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 pl-5 marker:text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-5 marker:text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-border pl-3 text-xs leading-5 text-muted-foreground">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
              href={href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {children}
            </a>
          ),
          pre: ({ children }) => (
            <pre className="no-scrollbar my-4 overflow-x-auto rounded-xl border border-border bg-background/70 p-4 text-xs leading-5">
              {children}
            </pre>
          ),
          code: ({ children, className: codeClassName }) => {
            const isCodeBlock = Boolean(codeClassName) || String(children).includes("\n")

            return (
              <code
                className={cn(
                  "font-mono",
                  isCodeBlock
                    ? "text-foreground"
                    : "rounded-md border border-border bg-muted px-1.5 py-0.5 text-[0.85em] text-primary",
                  codeClassName,
                )}
              >
                {children}
              </code>
            )
          },
          table: ({ children }) => (
            <div className="no-scrollbar my-4 overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[32rem] border-collapse text-left text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/70">{children}</thead>,
          th: ({ children }) => (
            <th className="border-b border-border px-3 py-2 font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border px-3 py-2 align-top last:border-b-0">
              {children}
            </td>
          ),
          hr: () => <hr className="my-5 border-border" />,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        }}
      >
        {normalizeLegacyMarkdown(content)}
      </ReactMarkdown>
    </div>
  )
}

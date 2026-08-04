"use client"

import { useMemo, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { ActionButton, FieldLabel, Panel, textAreaClass } from "@/components/tools/ui"

const SAMPLE = `# Hello world

A **tiny** Markdown to HTML converter with _live_ preview.

## Features
- Headings and lists
- [Links](https://vercel.com)
- \`inline code\`

> Blockquotes too!`

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function mdToHtml(md: string) {
  const escaped = escapeHtml(md)
  const lines = escaped.split("\n")
  const html: string[] = []
  let inList = false
  let inQuote = false

  const inline = (t: string) =>
    t
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(?:_|\*)([^_*]+)(?:_|\*)/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')

  const closeList = () => {
    if (inList) {
      html.push("</ul>")
      inList = false
    }
  }
  const closeQuote = () => {
    if (inQuote) {
      html.push("</blockquote>")
      inQuote = false
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      closeList()
      closeQuote()
      const level = heading[1].length
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      continue
    }
    if (/^[-*]\s+/.test(line)) {
      closeQuote()
      if (!inList) {
        html.push("<ul>")
        inList = true
      }
      html.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`)
      continue
    }
    if (/^>\s?/.test(line)) {
      closeList()
      if (!inQuote) {
        html.push("<blockquote>")
        inQuote = true
      }
      html.push(`<p>${inline(line.replace(/^>\s?/, ""))}</p>`)
      continue
    }
    if (line === "") {
      closeList()
      closeQuote()
      continue
    }
    closeList()
    closeQuote()
    html.push(`<p>${inline(line)}</p>`)
  }
  closeList()
  closeQuote()
  return html.join("\n")
}

export function MarkdownToHtml() {
  const [input, setInput] = useState(SAMPLE)
  const output = useMemo(() => mdToHtml(input), [input])

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-4">
      <Panel>
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <FieldLabel htmlFor="md-input">Markdown</FieldLabel>
          <div className="flex gap-2">
            <ActionButton variant="outline" onClick={() => setInput(SAMPLE)}>
              Sample
            </ActionButton>
            <ActionButton variant="outline" onClick={() => setInput("")}>
              Clear
            </ActionButton>
          </div>
        </div>
        <textarea
          id="md-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type Markdown here…"
          spellCheck={false}
          className={textAreaClass("min-h-[250px] lg:min-h-[360px]")}
        />
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel>
          <FieldLabel htmlFor="preview">Preview</FieldLabel>
          <div
            id="preview"
            className="prose-tool scroll-thin min-h-[180px] lg:min-h-[150px] overflow-auto rounded-xl border border-border bg-background p-4"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </Panel>
        <Panel>
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <FieldLabel htmlFor="html-output">HTML output</FieldLabel>
            <CopyButton value={output} />
          </div>
          <pre className="scroll-thin max-h-[180px] lg:max-h-[220px] overflow-auto rounded-xl border border-border bg-background p-3 font-mono text-xs leading-relaxed">
            {output}
          </pre>
        </Panel>
      </div>
    </div>
  )
}

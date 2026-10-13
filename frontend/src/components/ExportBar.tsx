import React, { useState } from 'react'
import { Download, Copy, Check, RotateCcw, FileText } from 'lucide-react'
import type { ScopeAnalysisResponse } from '../types'
import { downloadMarkdownFile, generateMarkdownReport } from '../utils/exportMarkdown'

interface ExportBarProps {
  analysis: ScopeAnalysisResponse
  onReset: () => void
}

export const ExportBar: React.FC<ExportBarProps> = ({ analysis, onReset }) => {
  const [copiedSummary, setCopiedSummary] = useState(false)

  const handleDownloadReport = () => {
    const markdown = generateMarkdownReport(analysis)
    const sanitizedTitle = analysis.project_title.replace(/[^a-zA-Z0-9_-]/g, '_')
    const filename = `ScopeGuard_Audit_${sanitizedTitle}.md`
    downloadMarkdownFile(filename, markdown)
  }

  const handleCopySummary = () => {
    const summaryText = `ScopeGuard Audit: ${analysis.project_title}
Risk Level: ${analysis.summary.overall_risk_level.toUpperCase()}
Items: ${analysis.summary.total_findings} total (${analysis.summary.out_of_scope_count} out-of-scope, ${analysis.summary.included_count} included, ${analysis.summary.uncertain_count} uncertain)
Overview: ${analysis.summary.overview}`

    navigator.clipboard.writeText(summaryText)
    setCopiedSummary(true)
    setTimeout(() => setCopiedSummary(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-3 text-xs text-slate-500">
        <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
        <div>
          <span className="font-semibold text-slate-800">Export & Audit Management:</span>
          <p className="text-[11px] text-slate-500">
            Export full evidence dossier or reset workspace for your next client consultation.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={handleCopySummary}
          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex items-center space-x-1.5"
        >
          {copiedSummary ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Summary Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Summary</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDownloadReport}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Markdown (.md)</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-700 text-xs font-semibold transition-colors flex items-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          <span>New Analysis</span>
        </button>
      </div>
    </div>
  )
}

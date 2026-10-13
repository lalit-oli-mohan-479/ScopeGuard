import React, { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  ShieldAlert,
  FileText,
  MessageSquare,
  ArrowRight,
  Info,
} from 'lucide-react'
import type { FindingClassification, ScopeAnalysisResponse, ScopeFinding } from '../types'

interface DashboardProps {
  analysis: ScopeAnalysisResponse
}

export const Dashboard: React.FC<DashboardProps> = ({ analysis }) => {
  const [filter, setFilter] = useState<'all' | FindingClassification>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { summary, findings } = analysis

  const filteredFindings = findings.filter((f) => {
    if (filter === 'all') return true
    return f.classification === filter
  })

  const handleCopyFinding = (item: ScopeFinding) => {
    const text = `ScopeGuard Finding: ${item.title}
Classification: ${item.classification.toUpperCase()} (${item.confidence_score}% confidence)
Client Request: "${item.client_request_excerpt}"
Original Scope: ${item.original_scope_reference ? `"${item.original_scope_reference}"` : 'None found'}
Explanation: ${item.explanation}
Suggested Action: ${item.suggested_action}`

    navigator.clipboard.writeText(text)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div id="results-dashboard" className="space-y-8 animate-in fade-in duration-300">
      {/* Demo Scenario Banner if applicable */}
      {analysis.is_demo && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Sample Scenario Demo Data:</strong> Demonstrates freelance website developer scope audit (5-page site vs eCommerce/auth).
            </span>
          </div>
          <span className="font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px]">
            Demo Walkthrough
          </span>
        </div>
      )}

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Findings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Evaluated
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {summary.total_findings}
            </span>
            <span className="text-xs text-slate-400">items</span>
          </div>
        </div>

        {/* Potentially Out of Scope (Amber) */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs bg-gradient-to-br from-amber-50/40 to-white flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Out of Scope
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-amber-700 font-mono">
              {summary.out_of_scope_count}
            </span>
            <span className="text-xs text-amber-700 font-semibold">Flagged</span>
          </div>
        </div>

        {/* Included in Scope (Emerald) */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs bg-gradient-to-br from-emerald-50/40 to-white flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Included
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-emerald-700 font-mono">
              {summary.included_count}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">Agreed</span>
          </div>
        </div>

        {/* Uncertain / Ambiguous (Slate) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs bg-gradient-to-br from-slate-100/50 to-white flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Uncertain
            </span>
            <HelpCircle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-slate-700 font-mono">
              {summary.uncertain_count}
            </span>
            <span className="text-xs text-slate-600 font-semibold">Needs info</span>
          </div>
        </div>
      </div>

      {/* Scope Change Alert & Executive Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Executive Scope Assessment
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Risk Assessment:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                summary.overall_risk_level === 'high'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : summary.overall_risk_level === 'moderate'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {summary.overall_risk_level} Risk
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed font-normal">
          {summary.overview}
        </p>

        {summary.requires_scope_change && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Formal Scope Adjustment Recommended</p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                At least one requested capability falls outside the agreed statement of work.
                Use the drafted client response below to present an add-on or revised timeline before starting implementation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Findings List Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900">
            Evidence-Backed Findings ({findings.length})
          </h3>

          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({findings.length})
            </button>
            <button
              onClick={() => setFilter('potentially_out_of_scope')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'potentially_out_of_scope'
                  ? 'bg-amber-100 text-amber-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Out of Scope ({summary.out_of_scope_count})
            </button>
            <button
              onClick={() => setFilter('included')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'included'
                  ? 'bg-emerald-100 text-emerald-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Included ({summary.included_count})
            </button>
            <button
              onClick={() => setFilter('uncertain')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'uncertain'
                  ? 'bg-slate-200 text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Uncertain ({summary.uncertain_count})
            </button>
          </div>
        </div>

        {/* Individual Finding Cards */}
        <div className="space-y-4">
          {filteredFindings.map((finding) => {
            const isOutOfScope = finding.classification === 'potentially_out_of_scope'
            const isIncluded = finding.classification === 'included'
            const isUncertain = finding.classification === 'uncertain'

            return (
              <div
                key={finding.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-xs space-y-4 ${
                  isOutOfScope
                    ? 'border-amber-300 hover:border-amber-400'
                    : isIncluded
                    ? 'border-emerald-300 hover:border-emerald-400'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                {/* Finding Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    {/* Badge */}
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                        isOutOfScope
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : isIncluded
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      {isOutOfScope && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                      {isIncluded && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {isUncertain && <HelpCircle className="w-3.5 h-3.5 text-slate-500" />}
                      <span>
                        {isOutOfScope
                          ? 'Potentially Out of Scope'
                          : isIncluded
                          ? 'Included Scope'
                          : 'Uncertain / Boundary Unclear'}
                      </span>
                    </span>

                    <span className="text-xs text-slate-400 font-mono font-medium">
                      Confidence: {finding.confidence_score}%
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyFinding(finding)}
                    className="self-end sm:self-auto text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-md hover:bg-slate-100 border border-slate-200/60 transition-colors flex items-center space-x-1"
                  >
                    {copiedId === finding.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Finding</span>
                      </>
                    )}
                  </button>
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {finding.title}
                </h4>

                {/* Evidence Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Client Request Excerpt */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3 text-amber-600" />
                      <span>New Client Request Excerpt</span>
                    </span>
                    <blockquote className="font-serif italic text-slate-800 text-xs">
                      "{finding.client_request_excerpt}"
                    </blockquote>
                  </div>

                  {/* Supporting Passage from Original Scope */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                      <FileText className="w-3 h-3 text-indigo-600" />
                      <span>Original Scope Reference</span>
                    </span>
                    {finding.original_scope_reference ? (
                      <blockquote className="font-serif italic text-slate-800 text-xs">
                        "{finding.original_scope_reference}"
                      </blockquote>
                    ) : (
                      <p className="text-slate-400 italic">
                        Not referenced in original agreement text.
                      </p>
                    )}
                  </div>
                </div>

                {/* Explanation */}
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900">Analysis: </span>
                  {finding.explanation}
                </div>

                {/* Suggested Action Callout */}
                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start space-x-2 text-xs text-indigo-950">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-indigo-900">Suggested Action: </span>
                    <span className="text-indigo-800">{finding.suggested_action}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import {
  Sparkles,
  FileText,
  MessageSquare,
  Trash2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react'
import type { DemoScenario } from '../types'

interface WorkspaceProps {
  originalScope: string
  setOriginalScope: (val: string) => void
  clientRequest: string
  setClientRequest: (val: string) => void
  projectTitle: string
  setProjectTitle: (val: string) => void
  freelancerName: string
  setFreelancerName: (val: string) => void
  clientName: string
  setClientName: (val: string) => void
  onAnalyze: () => void
  onSelectScenario: (scenario: DemoScenario) => void
  availableScenarios: DemoScenario[]
  isLoading: boolean
  maxChars?: number
  minChars?: number
}

export const Workspace: React.FC<WorkspaceProps> = ({
  originalScope,
  setOriginalScope,
  clientRequest,
  setClientRequest,
  projectTitle,
  setProjectTitle,
  freelancerName,
  setFreelancerName,
  clientName,
  setClientName,
  onAnalyze,
  onSelectScenario,
  availableScenarios,
  isLoading,
  maxChars = 25000,
  minChars = 10,
}) => {
  const [showMetadata, setShowMetadata] = useState(false)

  const isScopeTooShort = originalScope.trim().length > 0 && originalScope.trim().length < minChars
  const isRequestTooShort = clientRequest.trim().length > 0 && clientRequest.trim().length < minChars
  const canAnalyze =
    originalScope.trim().length >= minChars &&
    clientRequest.trim().length >= minChars &&
    !isLoading

  const handleClear = () => {
    setOriginalScope('')
    setClientRequest('')
    setProjectTitle('Five-Page Business Website')
  }

  return (
    <section id="workspace-section" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Workspace Header & Scenario Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Scope Comparison Workspace</span>
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Paste your signed contract deliverables and the client's latest message to evaluate scope boundaries.
          </p>
        </div>

        {/* Quick Sample Data Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
            <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
            <span>Load Sample Data:</span>
          </span>
          {availableScenarios.map((sc, i) => (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                i === 0
                  ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title={sc.description}
            >
              {sc.label.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor 1: Original Project Scope */}
        <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
            <label htmlFor="original-scope" className="flex items-center space-x-2 font-semibold text-sm text-slate-800">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>1. Original Project Scope / Agreement</span>
            </label>
            <div className="text-xs text-slate-400 font-mono">
              <span className={originalScope.length > maxChars ? 'text-rose-500 font-bold' : ''}>
                {originalScope.length.toLocaleString()}
              </span>
              /{maxChars.toLocaleString()} chars
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <textarea
              id="original-scope"
              rows={9}
              value={originalScope}
              onChange={(e) => setOriginalScope(e.target.value)}
              placeholder="Paste the agreed deliverables, statement of work (SOW), or contract excerpt here...&#10;&#10;Example:&#10;Build a five-page business website with a responsive layout, contact form, and basic SEO."
              className="w-full flex-1 resize-none border-0 p-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-0 leading-relaxed font-normal"
            />
          </div>

          {isScopeTooShort && (
            <div className="px-4 py-2 bg-amber-50 border-t border-amber-200/60 text-xs text-amber-700 flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Please enter at least {minChars} characters of the original scope.</span>
            </div>
          )}
        </div>

        {/* Editor 2: New Client Request */}
        <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
            <label htmlFor="client-request" className="flex items-center space-x-2 font-semibold text-sm text-slate-800">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>2. New Client Request / Message</span>
            </label>
            <div className="text-xs text-slate-400 font-mono">
              <span className={clientRequest.length > maxChars ? 'text-rose-500 font-bold' : ''}>
                {clientRequest.length.toLocaleString()}
              </span>
              /{maxChars.toLocaleString()} chars
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <textarea
              id="client-request"
              rows={9}
              value={clientRequest}
              onChange={(e) => setClientRequest(e.target.value)}
              placeholder="Paste the new email, chat message, or feature request from the client here...&#10;&#10;Example:&#10;Can you also add Stripe payments, an admin dashboard for managing orders, and customer accounts?"
              className="w-full flex-1 resize-none border-0 p-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-0 leading-relaxed font-normal"
            />
          </div>

          {isRequestTooShort && (
            <div className="px-4 py-2 bg-amber-50 border-t border-amber-200/60 text-xs text-amber-700 flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Please enter at least {minChars} characters for the client request.</span>
            </div>
          )}
        </div>
      </div>

      {/* Optional Metadata Drawer */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowMetadata(!showMetadata)}
          className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center space-x-1 transition-colors"
        >
          <span>{showMetadata ? 'Hide' : 'Customize'} Project & Response Placeholders</span>
          {showMetadata ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showMetadata && (
          <div className="mt-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="meta-project-title" className="block text-xs font-medium text-slate-600 mb-1">
                Project Title
              </label>
              <input
                id="meta-project-title"
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g., Five-Page Business Website"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="meta-freelancer-name" className="block text-xs font-medium text-slate-600 mb-1">
                Freelancer / Your Name
              </label>
              <input
                id="meta-freelancer-name"
                type="text"
                value={freelancerName}
                onChange={(e) => setFreelancerName(e.target.value)}
                placeholder="e.g., Alex"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="meta-client-name" className="block text-xs font-medium text-slate-600 mb-1">
                Client / Contact Name
              </label>
              <input
                id="meta-client-name"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g., Sarah"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Footer Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-100/60 p-3.5 rounded-2xl border border-slate-200">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>Local inference protects confidential agreements and rates.</span>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleClear}
            disabled={!originalScope && !clientRequest}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200/70 text-slate-600 text-xs font-semibold disabled:opacity-40 transition-all flex items-center justify-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            type="button"
            id="analyze-request-btn"
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold shadow-sm shadow-indigo-200 disabled:shadow-none transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Analyzing...' : 'Analyze Request'}</span>
          </button>
        </div>
      </div>
    </section>
  )
}

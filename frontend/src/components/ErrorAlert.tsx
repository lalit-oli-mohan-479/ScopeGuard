import React, { useState } from 'react'
import { AlertTriangle, Copy, Check, RotateCcw, Terminal, Zap } from 'lucide-react'
import type { ApiErrorDetail } from '../types'

interface ErrorAlertProps {
  error: ApiErrorDetail
  onRetry: () => void
  onExploreDemo: () => void
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onRetry,
  onExploreDemo,
}) => {
  const [copied, setCopied] = useState(false)
  const setupCmd = error.setup_command || `ollama run ${error.configured_model || 'qwen2.5:3b'}`

  const handleCopy = () => {
    navigator.clipboard.writeText(setupCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isOllamaOffline = error.error === 'OLLAMA_OFFLINE'
  const isModelMissing = error.error === 'MODEL_NOT_FOUND'

  return (
    <div className="my-8 max-w-3xl mx-auto px-4">
      <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-6 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex items-start space-x-3.5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-amber-900">
              {isOllamaOffline
                ? 'Local Ollama Service Is Not Running'
                : isModelMissing
                ? 'Open-Weight Model Not Found Locally'
                : 'Local AI Inference Error'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              {error.message}
            </p>
          </div>
        </div>

        {/* Setup Instructions & Command */}
        <div className="bg-slate-900 rounded-xl p-4 text-slate-100 space-y-2 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 font-medium">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Run this command in your terminal to start Ollama with the model:</span>
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="font-mono text-xs sm:text-sm bg-slate-950 p-2.5 rounded-lg text-emerald-400 select-all overflow-x-auto">
            {setupCmd}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {error.can_retry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Analysis</span>
            </button>
          )}

          <button
            onClick={onExploreDemo}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Explore Demo Results Walkthrough</span>
          </button>
        </div>
      </div>
    </div>
  )
}

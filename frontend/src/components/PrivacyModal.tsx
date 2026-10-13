import React from 'react'
import { X, Lock, ShieldCheck, Database, EyeOff } from 'lucide-react'
import type { HealthResponse } from '../types'

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
  health: HealthResponse | null
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  health,
}) => {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 id="privacy-modal-title" className="text-base font-semibold text-slate-900">
                Local-First AI & Confidentiality Architecture
              </h3>
              <p className="text-xs text-slate-500">
                Protecting freelance contracts, NDAs, and client trust
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm text-slate-600 max-h-[75vh] overflow-y-auto">
          {/* Active Local AI Status Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Current Inference Node
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  health?.ollama_connected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {health?.ollama_connected ? 'Ollama Active' : 'Ollama Offline'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Target Endpoint:</span>{' '}
                <span className="font-mono text-slate-800 font-medium">
                  {health?.ollama_url || 'http://localhost:11434'}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Configured Model:</span>{' '}
                <span className="font-mono text-slate-800 font-medium">
                  {health?.configured_model || 'qwen2.5:3b'}
                </span>
              </div>
            </div>
          </div>

          {/* Privacy Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Core Confidentiality Guarantees
            </h4>

            <div className="flex items-start space-x-3">
              <div className="p-1 rounded-md bg-emerald-100 text-emerald-700 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  Zero Third-Party Cloud Transmission
                </p>
                <p className="text-xs text-slate-500">
                  Your project agreements, client emails, and rates never travel to OpenAI,
                  Anthropic, or external cloud inference providers. Analysis executes on your
                  local CPU or GPU via Ollama.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1 rounded-md bg-indigo-100 text-indigo-700 mt-0.5">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  In-Memory Processing Only (No Database)
                </p>
                <p className="text-xs text-slate-500">
                  Documents exist only in browser memory and backend runtime RAM while analysis
                  is executing. Nothing is persisted to a database, local disk logs, or external telemetry.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1 rounded-md bg-violet-100 text-violet-700 mt-0.5">
                <EyeOff className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  Untrusted Input Isolation & Defense
                </p>
                <p className="text-xs text-slate-500">
                  Client messages are treated strictly as untrusted raw text enclosed in boundary
                  tags. Prompt injection attempts inside client requests are isolated and ignored.
                </p>
              </div>
            </div>
          </div>

          {/* Offline Nuance Notice */}
          <div className="p-3.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-1">
            <p className="font-semibold flex items-center space-x-1">
              <span>Notice on Total Offline Operation:</span>
            </p>
            <p className="text-amber-800 leading-relaxed">
              Once you download the Ollama application and the model weights (e.g.,{' '}
              <code className="bg-amber-100/70 px-1 py-0.5 rounded font-mono">
                ollama run qwen2.5:3b
              </code>
              ), ScopeGuard can run 100% offline without internet access. Note that the initial
              model download and package installation require a standard internet connection.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  )
}

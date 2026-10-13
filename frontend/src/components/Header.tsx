import React from 'react'
import { ShieldCheck, Cpu, Lock, RotateCcw } from 'lucide-react'
import type { HealthResponse } from '../types'

interface HeaderProps {
  health: HealthResponse | null
  onOpenPrivacy: () => void
  onReset: () => void
  hasAnalysis: boolean
}

export const Header: React.FC<HeaderProps> = ({
  health,
  onOpenPrivacy,
  onReset,
  hasAnalysis,
}) => {
  const isHealthy = health?.status === 'healthy'
  const isDegraded = health?.status === 'degraded'

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 flex items-center justify-center shadow-sm shadow-indigo-200 text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Scope<span className="text-indigo-600">Guard</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Local-First AI
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Freelance Scope Creep & Boundary Detector
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Health status badge */}
          <button
            onClick={onOpenPrivacy}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            title="Click to view Local AI & Privacy Details"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isHealthy
                  ? 'bg-emerald-500 ring-2 ring-emerald-200'
                  : isDegraded
                  ? 'bg-amber-500 ring-2 ring-amber-200'
                  : 'bg-slate-400'
              }`}
            />
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Local AI:</span>
            <span className="font-semibold text-slate-800">
              {health?.configured_model || 'qwen2.5:3b'}
            </span>
          </button>

          {/* Privacy Button */}
          <button
            onClick={onOpenPrivacy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Privacy & Offline</span>
          </button>

          {/* Reset Workspace button if analysis is displayed */}
          {hasAnalysis && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Reset analysis and start fresh"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">New Audit</span>
            </button>
          )}

          {/* GitHub link */}
          <a
            href="https://github.com/lalit-oli-mohan-479/ScopeGuard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-slate-600 hover:text-indigo-600 px-2 py-1 rounded transition-colors hidden sm:block"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  )
}

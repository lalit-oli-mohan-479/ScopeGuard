import React from 'react'
import { ShieldAlert, ArrowDown, Sparkles, CheckCircle2, Lock, Zap } from 'lucide-react'

interface HeroProps {
  onScrollToWorkspace: () => void
  onLoadDemo: () => void
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToWorkspace,
  onLoadDemo,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-12 border-b border-slate-200/60 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Hacktoberfest Tag */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hacktoberfest 2026 • Open-Source AI Challenge (Week 2: Side Hustle)</span>
        </div>

        {/* Main Title & Subtitle */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Stop scope creep before it costs you.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
            Compare client requests against your original agreement with AI that
            can run locally on your machine.
          </p>
        </div>

        {/* Core Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left pt-2">
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">
              100% Private & Local
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Open-weight models run on your machine via Ollama. No client data sent to third-party cloud APIs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-200 transition-all">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">
              Evidence-Backed Auditing
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Distinguishes real scope creep from reasonable implementation details with exact quotes and confidence scores.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">
              Polite Client Reply Drafts
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Generates 3 response tones (Friendly, Firm, Direct) offering scope adjustments without inventing prices.
            </p>
          </div>
        </div>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            onClick={onScrollToWorkspace}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm shadow-indigo-200 hover:shadow-indigo-300 transition-all"
          >
            <span>Analyze a Request</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={onLoadDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm transition-all shadow-xs"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Load Website Developer Demo</span>
          </button>
        </div>
      </div>
    </section>
  )
}

import React from 'react'
import { ShieldCheck, Heart, Sparkles } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-10 mt-16 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">
                Scope<span className="text-indigo-600">Guard</span>
              </span>
              <p className="text-[11px] text-slate-500">
                AI-Powered Freelance Scope Creep Detector
              </p>
            </div>
          </div>

          {/* Hacktoberfest Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Hacktoberfest 2026 • Open-Source AI Challenge</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-4 text-xs font-medium">
            <a
              href="https://github.com/lalit-oli-mohan-479/ScopeGuard"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors"
            >
              GitHub Repository
            </a>
            <span>•</span>
            <span className="text-slate-400">MIT License</span>
            <span>•</span>
            <span className="text-slate-400">Local-First Architecture</span>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>
            ScopeGuard is designed for freelance developers, designers, and consultants.
            Runs on local hardware via Ollama. No user contracts are logged or persisted.
          </p>
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for independent creators</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

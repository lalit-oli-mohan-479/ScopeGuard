import React, { useEffect, useState } from 'react'
import { Cpu, CheckCircle2, Loader2 } from 'lucide-react'

export const AnalysisLoading: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    'Connecting to local Ollama inference service...',
    'Extracting deliverable boundaries from original scope...',
    'Evaluating client request against agreement & calculating confidence...',
    'Drafting tailored client reply alternatives (Friendly, Firm, Direct)...',
  ]

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1500)
    const timer2 = setTimeout(() => setCurrentStep(2), 3500)
    const timer3 = setTimeout(() => setCurrentStep(3), 6000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className="py-12 max-w-2xl mx-auto px-4 text-center space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-inner animate-pulse">
        <Cpu className="w-7 h-7" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Analyzing Scope Boundaries Locally
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Inference running on your hardware. Processing documents in-memory.
        </p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-left space-y-3">
        {steps.map((text, idx) => {
          const isDone = idx < currentStep
          const isCurrent = idx === currentStep

          return (
            <div
              key={text}
              className={`flex items-center space-x-3 text-xs transition-opacity duration-300 ${
                isDone
                  ? 'text-emerald-700 font-medium'
                  : isCurrent
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
              </div>
              <span>{text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

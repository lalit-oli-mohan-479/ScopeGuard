import React, { useState, useEffect } from 'react'
import {
  MessageSquare,
  Copy,
  Check,
  Smile,
  Briefcase,
  Zap,
  Info,
  RotateCcw,
} from 'lucide-react'
import type { ReplyStyle } from '../types'

interface ReplyGeneratorProps {
  initialReplies: ReplyStyle
}

type StyleKey = 'friendly' | 'professional' | 'direct'

export const ReplyGenerator: React.FC<ReplyGeneratorProps> = ({
  initialReplies,
}) => {
  const [activeStyle, setActiveStyle] = useState<StyleKey>('professional')
  const [replies, setReplies] = useState<ReplyStyle>(initialReplies)
  const [copied, setCopied] = useState(false)

  // Keep in sync when new analysis is delivered
  useEffect(() => {
    setReplies(initialReplies)
  }, [initialReplies])

  const handleCopy = () => {
    navigator.clipboard.writeText(replies[activeStyle])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTextChange = (text: string) => {
    setReplies((prev) => ({
      ...prev,
      [activeStyle]: text,
    }))
  }

  const handleResetCurrent = () => {
    setReplies((prev) => ({
      ...prev,
      [activeStyle]: initialReplies[activeStyle],
    }))
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Professional Client Reply Generator
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a tone, customize your placeholders, and send to your client.
          </p>
        </div>

        {/* 3 Style Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveStyle('friendly')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeStyle === 'friendly'
                ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-indigo-500" />
            <span>1. Friendly</span>
          </button>

          <button
            onClick={() => setActiveStyle('professional')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeStyle === 'professional'
                ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            <span>2. Firm & Professional</span>
          </button>

          <button
            onClick={() => setActiveStyle('direct')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeStyle === 'direct'
                ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-indigo-500" />
            <span>3. Short & Direct</span>
          </button>
        </div>
      </div>

      {/* Placeholder Notice */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start space-x-2">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">
            Factual Placeholder Safety:
          </span>{' '}
          ScopeGuard never fabricates dollar amounts, deadlines, or penalties. Replace bracketed
          placeholders such as{' '}
          <code className="bg-slate-200/70 text-slate-900 px-1 py-0.5 rounded font-mono text-[11px]">
            [estimated additional cost]
          </code>{' '}
          or{' '}
          <code className="bg-slate-200/70 text-slate-900 px-1 py-0.5 rounded font-mono text-[11px]">
            [timeline impact]
          </code>{' '}
          before sending.
        </div>
      </div>

      {/* Editable Response Text Area */}
      <div className="relative">
        <textarea
          rows={8}
          value={replies[activeStyle]}
          onChange={(e) => handleTextChange(e.target.value)}
          className="w-full rounded-xl border border-slate-300 p-4 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
        />
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleResetCurrent}
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center space-x-1 transition-colors"
          title="Reset to original generated draft"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Draft</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-200 transition-all flex items-center space-x-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Response to Clipboard</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

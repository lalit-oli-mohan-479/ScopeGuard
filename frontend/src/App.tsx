import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Workspace } from './components/Workspace'
import { AnalysisLoading } from './components/AnalysisLoading'
import { ErrorAlert } from './components/ErrorAlert'
import { Dashboard } from './components/Dashboard'
import { ReplyGenerator } from './components/ReplyGenerator'
import { ExportBar } from './components/ExportBar'
import { PrivacyModal } from './components/PrivacyModal'
import { Footer } from './components/Footer'
import {
  ApiError,
  analyzeScope,
  fetchDemoData,
  fetchHealth,
} from './services/api'
import type {
  ApiErrorDetail,
  DemoApiResponse,
  DemoScenario,
  HealthResponse,
  ScopeAnalysisResponse,
} from './types'

export function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [demoData, setDemoData] = useState<DemoApiResponse | null>(null)

  const [originalScope, setOriginalScope] = useState<string>('')
  const [clientRequest, setClientRequest] = useState<string>('')
  const [projectTitle, setProjectTitle] = useState<string>('Five-Page Business Website')
  const [freelancerName, setFreelancerName] = useState<string>('Alex')
  const [clientName, setClientName] = useState<string>('Sarah')

  const [analysis, setAnalysis] = useState<ScopeAnalysisResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<ApiErrorDetail | null>(null)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false)

  // Fetch initial health and demo scenarios
  useEffect(() => {
    async function init() {
      const [h, d] = await Promise.all([
        fetchHealth(),
        fetchDemoData().catch(() => null),
      ])
      setHealth(h)
      if (d) {
        setDemoData(d)
        // Default to official website developer demo data
        setOriginalScope(d.primary_scenario.original_scope)
        setClientRequest(d.primary_scenario.client_request)
        setProjectTitle(d.primary_scenario.project_title)
      } else {
        // Fallback default
        setOriginalScope(
          'Build a five-page business website with a responsive layout, contact form, and basic SEO.'
        )
        setClientRequest(
          'Can you also add Stripe payments, an admin dashboard for managing orders, and customer accounts?'
        )
      }
    }
    init()
  }, [])

  const handleSelectScenario = (scenario: DemoScenario) => {
    setOriginalScope(scenario.original_scope)
    setClientRequest(scenario.client_request)
    setProjectTitle(scenario.project_title)
    setError(null)
  }

  const handleScrollToWorkspace = () => {
    const el = document.getElementById('workspace-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleAnalyze = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await analyzeScope({
        original_scope: originalScope,
        client_request: clientRequest,
        project_title: projectTitle,
        freelancer_name: freelancerName,
        client_name: clientName,
      })
      setAnalysis(result)

      // Smooth scroll to results
      setTimeout(() => {
        const el = document.getElementById('results-dashboard')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.detail)
      } else {
        setError({
          error: 'UNKNOWN_ERROR',
          message: err?.message || 'An unexpected error occurred during scope analysis.',
          can_retry: true,
          configured_model: health?.configured_model || 'qwen2.5:3b',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleExploreDemo = () => {
    if (demoData?.verified_sample_result) {
      setAnalysis(demoData.verified_sample_result)
      setError(null)
      setTimeout(() => {
        const el = document.getElementById('results-dashboard')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleReset = () => {
    setAnalysis(null)
    setError(null)
    handleScrollToWorkspace()
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <Header
        health={health}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onReset={handleReset}
        hasAnalysis={!!analysis}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onScrollToWorkspace={handleScrollToWorkspace}
          onLoadDemo={() => {
            if (demoData?.primary_scenario) {
              handleSelectScenario(demoData.primary_scenario)
            }
            handleScrollToWorkspace()
          }}
        />

        {/* Workspace Dual Textarea */}
        <Workspace
          originalScope={originalScope}
          setOriginalScope={setOriginalScope}
          clientRequest={clientRequest}
          setClientRequest={setClientRequest}
          projectTitle={projectTitle}
          setProjectTitle={setProjectTitle}
          freelancerName={freelancerName}
          setFreelancerName={setFreelancerName}
          clientName={clientName}
          setClientName={setClientName}
          onAnalyze={handleAnalyze}
          onSelectScenario={handleSelectScenario}
          availableScenarios={demoData?.available_scenarios || []}
          isLoading={isLoading}
        />

        {/* Loading State */}
        {isLoading && <AnalysisLoading />}

        {/* Error Alert State */}
        {error && !isLoading && (
          <ErrorAlert
            error={error}
            onRetry={handleAnalyze}
            onExploreDemo={handleExploreDemo}
          />
        )}

        {/* Results Section */}
        {analysis && !isLoading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Dashboard Findings */}
            <Dashboard analysis={analysis} />

            {/* Reply Generator */}
            <ReplyGenerator initialReplies={analysis.suggested_replies} />

            {/* Export & Reset Bar */}
            <ExportBar analysis={analysis} onReset={handleReset} />
          </div>
        )}
      </main>

      {/* Privacy & Confidentiality Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        health={health}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App

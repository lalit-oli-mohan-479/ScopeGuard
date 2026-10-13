export const SCOPEGUARD_VERSION = '1.0.0'

export type FindingClassification = 'included' | 'potentially_out_of_scope' | 'uncertain'

export interface ScopeFinding {
  id: string
  title: string
  client_request_excerpt: string
  original_scope_reference?: string | null
  classification: FindingClassification
  explanation: string
  confidence_score: number
  suggested_action: string
}

export interface ReplyStyle {
  friendly: string
  professional: string
  direct: string
}

export interface ScopeAnalysisSummary {
  overview: string
  total_findings: number
  included_count: number
  out_of_scope_count: number
  uncertain_count: number
  overall_risk_level: 'low' | 'moderate' | 'high'
  requires_scope_change: boolean
}

export interface ScopeAnalysisRequest {
  original_scope: string
  client_request: string
  project_title?: string
  freelancer_name?: string
  client_name?: string
}

export interface ScopeAnalysisResponse {
  id: string
  project_title: string
  summary: ScopeAnalysisSummary
  findings: ScopeFinding[]
  suggested_replies: ReplyStyle
  model_used: string
  analyzed_at: string
  is_demo: boolean
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'offline'
  ollama_connected: boolean
  ollama_url: string
  configured_model: string
  model_available: boolean
  available_models: string[]
  error_message?: string | null
  setup_command?: string | null
}

export interface DemoScenario {
  id: string
  label: string
  description: string
  original_scope: string
  client_request: string
  project_title: string
}

export interface DemoApiResponse {
  primary_scenario: DemoScenario
  available_scenarios: DemoScenario[]
  verified_sample_result: ScopeAnalysisResponse
}

export interface ApiErrorDetail {
  error: string
  message: string
  setup_command?: string | null
  configured_model?: string
  can_retry?: boolean
  hint?: string
}

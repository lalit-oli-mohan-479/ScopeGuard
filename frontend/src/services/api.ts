import type {
  ApiErrorDetail,
  DemoApiResponse,
  HealthResponse,
  ScopeAnalysisRequest,
  ScopeAnalysisResponse,
} from '../types'

const API_BASE = '/api'

export class ApiError extends Error {
  detail: ApiErrorDetail
  statusCode: number

  constructor(message: string, statusCode: number, detail: ApiErrorDetail) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.detail = detail
  }
}

export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE}/health`)
    if (!res.ok) {
      return {
        status: 'offline',
        ollama_connected: false,
        ollama_url: 'http://localhost:11434',
        configured_model: 'qwen2.5:3b',
        model_available: false,
        available_models: [],
        error_message: `Backend returned status ${res.status}`,
        setup_command: 'ollama run qwen2.5:3b',
      }
    }
    return await res.json()
  } catch (err) {
    return {
      status: 'offline',
      ollama_connected: false,
      ollama_url: 'http://localhost:11434',
      configured_model: 'qwen2.5:3b',
      model_available: false,
      available_models: [],
      error_message: 'Backend server is not reachable.',
      setup_command: 'ollama run qwen2.5:3b',
    }
  }
}

export async function fetchDemoData(): Promise<DemoApiResponse> {
  const res = await fetch(`${API_BASE}/demo`)
  if (!res.ok) {
    throw new Error('Failed to load demo scenario from backend.')
  }
  return await res.json()
}

export async function analyzeScope(
  request: ScopeAnalysisRequest
): Promise<ScopeAnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    let errorDetail: ApiErrorDetail
    try {
      errorDetail = await res.json()
    } catch {
      errorDetail = {
        error: 'UNKNOWN_ERROR',
        message: `Analysis request failed with HTTP ${res.status}`,
        can_retry: true,
      }
    }

    throw new ApiError(
      errorDetail.message || 'Scope analysis failed.',
      res.status,
      errorDetail
    )
  }

  return await res.json()
}

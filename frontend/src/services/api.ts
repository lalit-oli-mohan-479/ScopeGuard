import type {
  ApiErrorDetail,
  DemoApiResponse,
  HealthResponse,
  ScopeAnalysisRequest,
  ScopeAnalysisResponse,
} from '../types'
import {
  FALLBACK_DEMO_DATA,
  runClientSideAnalysis,
} from './demoFallbackData'

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
    if (res.ok) {
      return await res.json()
    }
  } catch {
    // Backend offline / GitHub Pages static mode
  }

  return {
    status: 'offline',
    ollama_connected: false,
    ollama_url: 'http://localhost:11434',
    configured_model: 'qwen2.5:3b',
    model_available: false,
    available_models: [],
    error_message: 'GitHub Pages Demo Mode. Connect local Ollama instance for live inference.',
    setup_command: 'ollama run qwen2.5:3b',
  }
}

export async function fetchDemoData(): Promise<DemoApiResponse> {
  try {
    const res = await fetch(`${API_BASE}/demo`)
    if (res.ok) {
      return await res.json()
    }
  } catch {
    // Backend offline / GitHub Pages static mode
  }

  // Graceful fallback so GitHub Pages visitors have all interactive scenarios immediately
  return FALLBACK_DEMO_DATA
}

export async function analyzeScope(
  request: ScopeAnalysisRequest
): Promise<ScopeAnalysisResponse> {
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (res.ok) {
      return await res.json()
    }

    if (res.status === 422 || res.status === 503) {
      let errorDetail: ApiErrorDetail
      try {
        errorDetail = await res.json()
      } catch {
        errorDetail = {
          error: 'ANALYSIS_ERROR',
          message: `Analysis request failed with HTTP ${res.status}`,
          can_retry: true,
        }
      }
      throw new ApiError(errorDetail.message || 'Scope analysis failed.', res.status, errorDetail)
    }
  } catch (err) {
    if (err instanceof ApiError) throw err
    // If network error / 404 (e.g. static hosting on GitHub Pages), run client-side engine!
    console.info('Backend unreachable, using client-side demo inference engine.')
  }

  // Simulated inference delay for realistic UX on web demo
  await new Promise((resolve) => setTimeout(resolve, 800))
  return runClientSideAnalysis(request)
}


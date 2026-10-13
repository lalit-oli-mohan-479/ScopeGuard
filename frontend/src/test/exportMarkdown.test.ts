import { describe, it, expect } from 'vitest'
import { generateMarkdownReport } from '../utils/exportMarkdown'
import type { ScopeAnalysisResponse, FindingClassification } from '../types'

describe('generateMarkdownReport', () => {
  const sampleAnalysis: ScopeAnalysisResponse = {
    id: 'test-audit-123',
    project_title: 'SaaS Dashboard Contract',
    summary: {
      overview: 'Client requested major mobile app extension.',
      total_findings: 2,
      included_count: 1,
      out_of_scope_count: 1,
      uncertain_count: 0,
      overall_risk_level: 'high',
      requires_scope_change: true,
    },
    findings: [
      {
        id: 'f-1',
        title: 'Native iOS & Android App',
        client_request_excerpt: 'Can we get native iOS and Android apps?',
        original_scope_reference: 'Build web dashboard using React.',
        classification: 'potentially_out_of_scope' as FindingClassification,
        explanation: 'Mobile native development is outside web application scope.',
        confidence_score: 98,
        suggested_action: 'Quote separate mobile phase.',
      },
      {
        id: 'f-2',
        title: 'Export to CSV',
        client_request_excerpt: 'Add CSV export for table data',
        original_scope_reference: 'Data table views with sorting and export.',
        classification: 'included' as FindingClassification,
        explanation: 'Explicitly included in table views.',
        confidence_score: 95,
        suggested_action: 'Proceed with implementation.',
      },
    ],
    suggested_replies: {
      friendly: 'Hi Sarah, happy to help with mobile apps in Phase 2 [estimated additional cost]!',
      professional: 'Hello Sarah, native mobile apps exceed the agreed statement of work.',
      direct: 'Mobile apps are out of scope. Would you like an updated quote?',
    },
    model_used: 'qwen2.5:3b',
    analyzed_at: '2026-10-13T10:00:00Z',
    is_demo: false,
  }

  it('generates a complete markdown report containing all sections', () => {
    const report = generateMarkdownReport(sampleAnalysis)

    expect(report).toContain('# ScopeGuard Scope Creep Audit: SaaS Dashboard Contract')
    expect(report).toContain('## 1. Executive Summary')
    expect(report).toContain('## 2. Detailed Findings & Evidence')
    expect(report).toContain('## 3. Recommended Client Reply Drafts')

    // Verifies findings are included
    expect(report).toContain('[OUT OF SCOPE] Native iOS & Android App')
    expect(report).toContain('[INCLUDED] Export to CSV')
    expect(report).toContain('98%')

    // Verifies replies are rendered
    expect(report).toContain('Hi Sarah, happy to help with mobile apps')
    expect(report).toContain('Hello Sarah, native mobile apps exceed')
    expect(report).toContain('Mobile apps are out of scope')

    // Verifies metadata
    expect(report).toContain('qwen2.5:3b (Local Inference)')
    expect(report).toContain('test-audit-123')
  })
})

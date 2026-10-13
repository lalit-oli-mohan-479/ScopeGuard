import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Workspace } from '../components/Workspace'
import type { DemoScenario } from '../types'

describe('Workspace component', () => {
  const mockScenario: DemoScenario = {
    id: 'test-scenario',
    label: 'Test Preset',
    description: 'A test scenario description',
    original_scope: 'Agreed 5 page web application.',
    client_request: 'Please also add Stripe payments.',
    project_title: 'Test Web App',
  }

  it('renders dual editors and disables analyze button when text is too short', () => {
    const handleAnalyze = vi.fn()
    const handleSelectScenario = vi.fn()

    render(
      <Workspace
        originalScope=""
        setOriginalScope={vi.fn()}
        clientRequest=""
        setClientRequest={vi.fn()}
        projectTitle="Test Project"
        setProjectTitle={vi.fn()}
        freelancerName="Alex"
        setFreelancerName={vi.fn()}
        clientName="Sarah"
        setClientName={vi.fn()}
        onAnalyze={handleAnalyze}
        onSelectScenario={handleSelectScenario}
        availableScenarios={[mockScenario]}
        isLoading={false}
        minChars={10}
      />
    )

    // Button should be disabled because inputs are empty (< 10 chars)
    const btn = screen.getByRole('button', { name: /Analyze Request/i }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)

    // Preset button should be present
    const presetBtn = screen.getByRole('button', { name: /Test Preset/i })
    expect(presetBtn).toBeDefined()

    fireEvent.click(presetBtn)
    expect(handleSelectScenario).toHaveBeenCalledWith(mockScenario)
  })

  it('enables analyze button when both inputs exceed minimum length', () => {
    const handleAnalyze = vi.fn()

    render(
      <Workspace
        originalScope="Build a five-page business website with a responsive layout."
        setOriginalScope={vi.fn()}
        clientRequest="Can you also add Stripe payments and an admin dashboard?"
        setClientRequest={vi.fn()}
        projectTitle="Test Project"
        setProjectTitle={vi.fn()}
        freelancerName="Alex"
        setFreelancerName={vi.fn()}
        clientName="Sarah"
        setClientName={vi.fn()}
        onAnalyze={handleAnalyze}
        onSelectScenario={vi.fn()}
        availableScenarios={[]}
        isLoading={false}
        minChars={10}
      />
    )

    const btn = screen.getByRole('button', { name: /Analyze Request/i }) as HTMLButtonElement
    expect(btn.disabled).toBe(false)

    fireEvent.click(btn)
    expect(handleAnalyze).toHaveBeenCalledTimes(1)
  })
})

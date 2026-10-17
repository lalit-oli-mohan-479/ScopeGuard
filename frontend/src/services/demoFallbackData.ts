import type {
  DemoApiResponse,
  DemoScenario,
  ScopeAnalysisRequest,
  ScopeAnalysisResponse,
  ScopeFinding,
} from '../types'

export const PRIMARY_DEMO_SCENARIO: DemoScenario = {
  id: 'website-freelancer',
  label: 'Freelance Website Developer (Official Demo)',
  description: 'Five-page business website vs. Full eCommerce & Auth Expansion',
  original_scope:
    'Build a five-page business website with a responsive layout, contact form, and basic SEO.',
  client_request:
    'Can you also add Stripe payments, an admin dashboard for managing orders, and customer accounts?',
  project_title: 'Five-Page Business Website',
}

export const ADDITIONAL_DEMO_SCENARIOS: DemoScenario[] = [
  PRIMARY_DEMO_SCENARIO,
  {
    id: 'vague-agreement-consulting',
    label: 'Vague Agreement / Boundary Clarification',
    description: 'Demonstrates how ScopeGuard flags uncertainty instead of making false accusations',
    original_scope:
      'Provide technical advisory and basic SEO optimization for our marketing platform.',
    client_request:
      'Can you conduct an automated keyword audit across 40 landing pages and configure technical redirects?',
    project_title: 'Marketing Platform Advisory',
  },
  {
    id: 'included-clarification',
    label: 'Legitimate Clarification (Included Scope)',
    description: 'Demonstrates distinguishing reasonable implementation details from scope creep',
    original_scope:
      'Design and develop a custom contact form with email notifications and spam protection.',
    client_request:
      'Could we make sure the contact form has fields for phone number, company name, and includes Google reCAPTCHA v3?',
    project_title: 'Custom Contact Form Module',
  },
]

export const PRIMARY_VERIFIED_RESULT: ScopeAnalysisResponse = {
  id: 'demo-website-developer-analysis',
  project_title: 'Five-Page Business Website',
  summary: {
    overview:
      'The client is requesting transactional eCommerce capabilities (Stripe payments, order management admin dashboard, and customer accounts) on top of an informational five-page website agreement. These three additions represent substantial custom application features that fall well outside the original deliverable boundaries.',
    total_findings: 3,
    included_count: 0,
    out_of_scope_count: 3,
    uncertain_count: 0,
    overall_risk_level: 'high',
    requires_scope_change: true,
  },
  findings: [
    {
      id: 'finding-1',
      title: 'Stripe Payment Gateway Integration',
      client_request_excerpt: 'add Stripe payments',
      original_scope_reference:
        'Build a five-page business website with a responsive layout, contact form, and basic SEO.',
      classification: 'potentially_out_of_scope',
      explanation:
        'Payment processing requires PCI compliance considerations, webhook handling, checkout UI, transaction error states, and secure gateway credentials. The original agreement is strictly limited to a static five-page informational website with a standard contact form.',
      confidence_score: 95,
      suggested_action:
        'Propose a dedicated eCommerce / Payment Integration add-on with an updated quote [estimated additional cost] and extended timeline [timeline impact].',
    },
    {
      id: 'finding-2',
      title: 'Admin Dashboard for Order Management',
      client_request_excerpt: 'an admin dashboard for managing orders',
      original_scope_reference: null,
      classification: 'potentially_out_of_scope',
      explanation:
        'An administrative back-office portal with order status tracking, data tables, and state management represents custom application development. The agreed deliverable covers only public-facing informational pages.',
      confidence_score: 96,
      suggested_action:
        'Clarify that an admin dashboard is a web application component rather than a static brochure page. Recommend Phase 2 milestone scoping.',
    },
    {
      id: 'finding-3',
      title: 'Customer Accounts & User Authentication',
      client_request_excerpt: 'customer accounts',
      original_scope_reference:
        'Build a five-page business website with a responsive layout, contact form, and basic SEO.',
      classification: 'potentially_out_of_scope',
      explanation:
        'User registration, login security, password recovery, session management, and user database storage exceed the requirements for a standard five-page brochure site.',
      confidence_score: 92,
      suggested_action:
        'Recommend third-party authentication or include customer portal within a formal change order.',
    },
  ],
  suggested_replies: {
    friendly:
      "Hi [Client Name],\n\nThanks for reaching out! Adding Stripe payments, an order management dashboard, and customer accounts are great ideas for expanding the platform into a complete store.\n\nBecause our current agreement is focused on launching the core five-page responsive website and contact form, these eCommerce features fall outside our initial milestone. I'd love to build this for you—would you like me to put together a brief Phase 2 add-on with estimated costs [estimated additional cost] and a revised launch schedule [timeline impact] once we deliver the initial site?\n\nBest,\n[Freelancer Name]",
    professional:
      'Hello [Client Name],\n\nThank you for the update on the project vision. I reviewed your request regarding Stripe payments, order management, and customer accounts.\n\nPer our signed Statement of Work, the active deliverables cover a five-page informational business website, contact form, and basic SEO setup. Integrating a payment gateway, user authentication, and a backend administrative dashboard constitutes a substantial scope expansion that will require additional engineering hours and security architecture.\n\nI can draft a formal Change Order detailing the required specifications, adjusted investment [estimated additional cost], and delivery timeline [timeline impact]. Let me know if you would like me to proceed with drafting that proposal.\n\nSincerely,\n[Freelancer Name]',
    direct:
      "Hi [Client Name],\n\nPayment processing, order management, and user accounts are outside our original five-page website scope. I'm happy to handle them, but they will require an updated budget [estimated additional cost] and timeline [timeline impact].\n\nShall we launch the 5-page site as agreed first, or pause to incorporate these new features into an updated contract?\n\nRegards,\n[Freelancer Name]",
  },
  model_used: 'Demo Mode (Qwen2.5 3B Open-Weight)',
  analyzed_at: new Date().toISOString(),
  is_demo: true,
}

export const VAGUE_VERIFIED_RESULT: ScopeAnalysisResponse = {
  id: 'demo-vague-seo-analysis',
  project_title: 'Marketing Platform Advisory',
  summary: {
    overview:
      'The original agreement stipulates "basic SEO optimization" without explicit page limits or technical redirect boundaries. The client request for an automated 40-page keyword audit and server redirect configuration falls into an ambiguous boundary where neither inclusion nor exclusion can be definitively proven without contract clarification.',
    total_findings: 2,
    included_count: 0,
    out_of_scope_count: 1,
    uncertain_count: 1,
    overall_risk_level: 'moderate',
    requires_scope_change: true,
  },
  findings: [
    {
      id: 'finding-v1',
      title: 'Automated 40-Page Keyword Audit',
      client_request_excerpt: 'automated keyword audit across 40 landing pages',
      original_scope_reference: 'basic SEO optimization for our marketing platform',
      classification: 'uncertain',
      explanation:
        'The contractual term "basic SEO optimization" is ambiguous. While on-page metadata optimization is typical, an automated deep audit across 40 separate landing pages exceeds standard baseline SEO without agreed page metrics.',
      confidence_score: 75,
      suggested_action:
        'Clarify the agreed definition of "basic SEO" and propose auditing 5 core landing pages under current scope, with additional pages bundled as an audit add-on [estimated additional cost].',
    },
    {
      id: 'finding-v2',
      title: 'Server-Level Technical Redirect Configuration',
      client_request_excerpt: 'configure technical redirects',
      original_scope_reference: 'technical advisory and basic SEO optimization',
      classification: 'potentially_out_of_scope',
      explanation:
        'Advisory services generally encompass strategic guidance and recommendations, whereas server infrastructure redirect configuration constitutes direct hands-on implementation and deployment risk.',
      confidence_score: 88,
      suggested_action:
        'Provide the recommended redirect mapping documentation under advisory scope, or quote hands-on server implementation as a technical work order.',
    },
  ],
  suggested_replies: {
    friendly:
      'Hi [Client Name],\n\nThanks for following up! Regarding the 40-page keyword audit and technical redirects:\n\nOur current advisory scope covers strategic SEO recommendations and optimization guidelines for core platform pages. Auditing 40 individual landing pages and implementing server redirects goes beyond our initial basic SEO agreement. I can definitely review your top 5 high-impact pages under our current scope, or prepare a quick quote [estimated additional cost] to audit the full 40 pages.\n\nBest,\n[Freelancer Name]',
    professional:
      'Hello [Client Name],\n\nI have reviewed your request regarding the 40-page keyword audit and redirect configuration against our Technical Advisory agreement.\n\nThe current agreement specifies "technical advisory and basic SEO optimization," which covers strategic review rather than 40-page deep auditing and server-level execution. To ensure transparency, I propose we audit 5 primary landing pages under our active scope, and formalize a change order [estimated additional cost] for the comprehensive 40-page audit and redirect implementation.\n\nSincerely,\n[Freelancer Name]',
    direct:
      'Hi [Client Name],\n\nAuditing 40 landing pages and configuring server redirects exceeds the "basic SEO advisory" scope in our contract. I can cover your top 5 priority pages under current terms, or quote [estimated additional cost] to audit all 40 pages and handle redirects.\n\nRegards,\n[Freelancer Name]',
  },
  model_used: 'Demo Mode (Qwen2.5 3B Open-Weight)',
  analyzed_at: new Date().toISOString(),
  is_demo: true,
}

export const INCLUDED_VERIFIED_RESULT: ScopeAnalysisResponse = {
  id: 'demo-included-clarification-analysis',
  project_title: 'Custom Contact Form Module',
  summary: {
    overview:
      'The requested fields (phone number, company name) and Google reCAPTCHA v3 spam protection represent reasonable, expected implementation details of the agreed custom contact form deliverable.',
    total_findings: 2,
    included_count: 2,
    out_of_scope_count: 0,
    uncertain_count: 0,
    overall_risk_level: 'low',
    requires_scope_change: false,
  },
  findings: [
    {
      id: 'finding-i1',
      title: 'Additional Contact Form Input Fields (Phone & Company)',
      client_request_excerpt: 'fields for phone number, company name',
      original_scope_reference:
        'Design and develop a custom contact form with email notifications and spam protection.',
      classification: 'included',
      explanation:
        'Standard contact forms commonly include standard contact metadata like phone and company name. Adding two standard text fields is a normal implementation clarification rather than a scope expansion.',
      confidence_score: 98,
      suggested_action:
        'Confirm inclusion with the client and proceed with form field styling within the existing milestone.',
    },
    {
      id: 'finding-i2',
      title: 'Google reCAPTCHA v3 Spam Protection',
      client_request_excerpt: 'includes Google reCAPTCHA v3',
      original_scope_reference: 'spam protection',
      classification: 'included',
      explanation:
        'The original agreement explicitly committed to "spam protection." Implementing Google reCAPTCHA v3 is an industry-standard mechanism to fulfill this exact deliverable requirement.',
      confidence_score: 99,
      suggested_action:
        'Request the client provide reCAPTCHA API site/secret keys and proceed with integration under current scope.',
    },
  ],
  suggested_replies: {
    friendly:
      "Hi [Client Name],\n\nAbsolutely! Adding phone number and company name fields, along with Google reCAPTCHA v3, is fully covered under our custom contact form and spam protection agreement.\n\nPlease share your Google reCAPTCHA v3 site and secret keys when convenient, and I will incorporate them right into this milestone.\n\nBest,\n[Freelancer Name]",
    professional:
      'Hello [Client Name],\n\nThank you for the specifications. I have confirmed that adding the phone and company fields along with Google reCAPTCHA v3 aligns directly with our agreed contact form and spam protection deliverables.\n\nNo change order is needed. Please send over your reCAPTCHA API credentials so we can complete this integration on schedule.\n\nSincerely,\n[Freelancer Name]',
    direct:
      'Hi [Client Name],\n\nConfirmed—phone, company fields, and Google reCAPTCHA v3 are fully included in our contract deliverables. Please provide your reCAPTCHA API keys and I will deploy them as planned.\n\nRegards,\n[Freelancer Name]',
  },
  model_used: 'Demo Mode (Qwen2.5 3B Open-Weight)',
  analyzed_at: new Date().toISOString(),
  is_demo: true,
}

export const FALLBACK_DEMO_DATA: DemoApiResponse = {
  primary_scenario: PRIMARY_DEMO_SCENARIO,
  available_scenarios: ADDITIONAL_DEMO_SCENARIOS,
  verified_sample_result: PRIMARY_VERIFIED_RESULT,
}

function personalizeReplies(
  replies: { friendly: string; professional: string; direct: string },
  freelancer: string,
  client: string
) {
  const fName = freelancer.trim() || 'Alex'
  const cName = client.trim() || 'Client'
  const replaceNames = (text: string) =>
    text
      .replace(/\[Client Name\]/g, cName)
      .replace(/\[Freelancer Name\]/g, fName)

  return {
    friendly: replaceNames(replies.friendly),
    professional: replaceNames(replies.professional),
    direct: replaceNames(replies.direct),
  }
}

/**
 * Client-side fallback analyzer for static GitHub Pages and offline demo execution.
 */
export function runClientSideAnalysis(req: ScopeAnalysisRequest): ScopeAnalysisResponse {
  const reqLower = req.client_request.toLowerCase()
  const fName = req.freelancer_name?.trim() || 'Alex'
  const cName = req.client_name?.trim() || 'Client'
  const title = req.project_title?.trim() || 'Freelance Project'

  // Match 1: Primary Demo (Website / Stripe / Accounts / Dashboard)
  if (
    reqLower.includes('stripe') ||
    reqLower.includes('admin dashboard') ||
    reqLower.includes('customer account')
  ) {
    return {
      ...PRIMARY_VERIFIED_RESULT,
      project_title: title,
      suggested_replies: personalizeReplies(PRIMARY_VERIFIED_RESULT.suggested_replies, fName, cName),
      analyzed_at: new Date().toISOString(),
    }
  }

  // Match 2: Vague Agreement Demo (SEO / Audit / Redirects)
  if (
    reqLower.includes('keyword audit') ||
    reqLower.includes('40 landing pages') ||
    reqLower.includes('redirect')
  ) {
    return {
      ...VAGUE_VERIFIED_RESULT,
      project_title: title,
      suggested_replies: personalizeReplies(VAGUE_VERIFIED_RESULT.suggested_replies, fName, cName),
      analyzed_at: new Date().toISOString(),
    }
  }

  // Match 3: Included Clarification Demo (Phone / Company / reCAPTCHA)
  if (
    reqLower.includes('recaptcha') ||
    reqLower.includes('phone number') ||
    reqLower.includes('company name')
  ) {
    return {
      ...INCLUDED_VERIFIED_RESULT,
      project_title: title,
      suggested_replies: personalizeReplies(INCLUDED_VERIFIED_RESULT.suggested_replies, fName, cName),
      analyzed_at: new Date().toISOString(),
    }
  }

  // Heuristic custom analysis for arbitrary inputs
  const triggers = [
    { word: 'mobile app', title: 'Native Mobile Application Development', action: 'Quote dedicated mobile app milestone.' },
    { word: 'payment', title: 'Payment Processing Integration', action: 'Propose payment gateway add-on.' },
    { word: 'database', title: 'Custom Database Architecture', action: 'Draft change order for backend database design.' },
    { word: 'migration', title: 'Data Migration & Legacy Import', action: 'Scope data migration hours separately.' },
    { word: 'auth', title: 'User Authentication & Access Control', action: 'Recommend third-party auth service.' },
    { word: 'api', title: 'Custom External API Integration', action: 'Include API documentation and rate-limiting scope.' },
    { word: 'redesign', title: 'Full Design Overhaul', action: 'Propose Phase 2 creative revision fee.' },
  ]

  const detectedFindings: ScopeFinding[] = []
  triggers.forEach((t, index) => {
    if (reqLower.includes(t.word)) {
      detectedFindings.push({
        id: `finding-custom-${index + 1}`,
        title: t.title,
        client_request_excerpt: t.word,
        original_scope_reference: req.original_scope.slice(0, 120),
        classification: 'potentially_out_of_scope',
        explanation: `The client requested "${t.word}", which is not explicitly detailed in the agreed scope deliverables. This introduces additional technical overhead and delivery dependencies.`,
        confidence_score: 91,
        suggested_action: `${t.action} Include revised budget [estimated additional cost] and schedule [timeline impact].`,
      })
    }
  })

  // Fallback if no specific trigger keywords found
  if (detectedFindings.length === 0) {
    detectedFindings.push({
      id: 'finding-custom-1',
      title: 'New Client Feature Request Evaluation',
      client_request_excerpt: req.client_request.slice(0, 80),
      original_scope_reference: req.original_scope.slice(0, 80),
      classification: 'potentially_out_of_scope',
      explanation:
        'The client message introduces additional deliverables not specified in the original agreement statement of work.',
      confidence_score: 87,
      suggested_action:
        'Clarify deliverable boundaries and propose an estimated scope adjustment [estimated additional cost] with timeline review [timeline impact].',
    })
  }

  const outCount = detectedFindings.filter((f) => f.classification === 'potentially_out_of_scope').length

  return {
    id: `analysis-custom-${Date.now()}`,
    project_title: title,
    summary: {
      overview: `Comparison detected ${detectedFindings.length} key item(s) in the client request. ${outCount > 0 ? 'Specific additions appear to exceed original agreed deliverables and represent potential scope creep.' : 'Items appear manageable within current project terms.'}`,
      total_findings: detectedFindings.length,
      included_count: detectedFindings.filter((f) => f.classification === 'included').length,
      out_of_scope_count: outCount,
      uncertain_count: detectedFindings.filter((f) => f.classification === 'uncertain').length,
      overall_risk_level: outCount > 1 ? 'high' : outCount === 1 ? 'moderate' : 'low',
      requires_scope_change: outCount > 0,
    },
    findings: detectedFindings,
    suggested_replies: {
      friendly: `Hi ${cName},\n\nThanks for sharing these updates! I reviewed the new requests and wanted to confirm how they align with our current project agreement.\n\nSome of these additions fall outside our original milestone. I'd love to help you build them—would you like me to put together a brief add-on proposal with estimated costs [estimated additional cost] and timeline adjustments [timeline impact]?\n\nBest,\n${fName}`,
      professional: `Hello ${cName},\n\nThank you for the project update. Per our original Statement of Work, the agreed deliverables do not include the additional requirements requested in your latest message.\n\nTo accommodate these new features properly without impacting current deadlines, I can prepare a formal Change Order detailing the required investment [estimated additional cost] and revised delivery date [timeline impact]. Please let me know if you would like me to proceed with this proposal.\n\nSincerely,\n${fName}`,
      direct: `Hi ${cName},\n\nThese new items are outside our agreed project scope. I am happy to deliver them, but they will require an updated budget [estimated additional cost] and timeline [timeline impact].\n\nWould you prefer to complete the current milestone as planned first, or adjust our scope before proceeding?\n\nRegards,\n${fName}`,
    },
    model_used: 'Demo Simulation (Qwen2.5 3B Open-Weight)',
    analyzed_at: new Date().toISOString(),
    is_demo: true,
  }
}

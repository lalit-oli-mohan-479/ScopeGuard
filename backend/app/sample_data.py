"""Predefined demo scenarios and verified sample analysis data for ScopeGuard."""

from datetime import datetime, timezone
from typing import List
from .models import (
    DemoScenario,
    ScopeAnalysisResponse,
    ScopeAnalysisSummary,
    ScopeFinding,
    FindingClassification,
    ReplyStyle,
)

# Primary demo scenario as requested in Hacktoberfest specifications
PRIMARY_DEMO_SCENARIO = DemoScenario(
    id="website-freelancer",
    label="Freelance Website Developer (Official Demo)",
    description="Five-page business website vs. Full eCommerce & Auth Expansion",
    original_scope=(
        "Build a five-page business website with a responsive layout, "
        "contact form, and basic SEO."
    ),
    client_request=(
        "Can you also add Stripe payments, an admin dashboard for managing "
        "orders, and customer accounts?"
    ),
    project_title="Five-Page Business Website",
)

ADDITIONAL_DEMO_SCENARIOS: List[DemoScenario] = [
    PRIMARY_DEMO_SCENARIO,
    DemoScenario(
        id="vague-agreement-consulting",
        label="Vague Agreement / Boundary Clarification",
        description="Demonstrates how ScopeGuard flags uncertainty instead of making false accusations",
        original_scope=(
            "Provide technical advisory and basic SEO optimization for our marketing platform."
        ),
        client_request=(
            "Can you conduct an automated keyword audit across 40 landing pages and configure technical redirects?"
        ),
        project_title="Marketing Platform Advisory",
    ),
    DemoScenario(
        id="included-clarification",
        label="Legitimate Clarification (Included Scope)",
        description="Demonstrates distinguishing reasonable implementation details from scope creep",
        original_scope=(
            "Design and develop a custom contact form with email notifications and spam protection."
        ),
        client_request=(
            "Could we make sure the contact form has fields for phone number, company name, and includes Google reCAPTCHA v3?"
        ),
        project_title="Custom Contact Form Module",
    ),
]


def get_verified_demo_response() -> ScopeAnalysisResponse:
    """Return a verified sample ScopeAnalysisResponse for the primary demo scenario.

    Identifies Stripe payments, admin order dashboard, and customer accounts
    as potentially out-of-scope while noting that final assessment depends on
    the complete agreement.
    """
    findings = [
        ScopeFinding(
            id="finding-1",
            title="Stripe Payment Gateway Integration",
            client_request_excerpt="add Stripe payments",
            original_scope_reference=(
                "Build a five-page business website with a responsive layout, "
                "contact form, and basic SEO."
            ),
            classification=FindingClassification.POTENTIALLY_OUT_OF_SCOPE,
            explanation=(
                "Payment processing requires PCI compliance consideration, webhook handling, "
                "checkout UI, transaction error flows, and secure gateway credentials. "
                "The original agreement is strictly limited to a static five-page informational "
                "website with a standard contact form."
            ),
            confidence_score=95,
            suggested_action=(
                "Propose a dedicated eCommerce / Payment Integration add-on with an updated "
                "quote [estimated additional cost] and extended timeline [timeline impact]."
            ),
        ),
        ScopeFinding(
            id="finding-2",
            title="Admin Dashboard for Order Management",
            client_request_excerpt="an admin dashboard for managing orders",
            original_scope_reference=None,
            classification=FindingClassification.POTENTIALLY_OUT_OF_SCOPE,
            explanation=(
                "An administrative back-office portal with order status tracking, data tables, "
                "and state management represents custom application development. The agreed "
                "deliverable covers only public-facing informational pages."
            ),
            confidence_score=96,
            suggested_action=(
                "Clarify that an admin dashboard is a web application component rather than "
                "a static brochure page. Recommend Phase 2 milestone scoping."
            ),
        ),
        ScopeFinding(
            id="finding-3",
            title="Customer Accounts & User Authentication",
            client_request_excerpt="customer accounts",
            original_scope_reference=(
                "Build a five-page business website with a responsive layout, "
                "contact form, and basic SEO."
            ),
            classification=FindingClassification.POTENTIALLY_OUT_OF_SCOPE,
            explanation=(
                "User registration, login security, password recovery, session management, "
                "and user database storage exceed the requirements for a standard five-page brochure site."
            ),
            confidence_score=92,
            suggested_action=(
                "Recommend third-party authentication or include customer portal within a formal change order."
            ),
        ),
    ]

    summary = ScopeAnalysisSummary(
        overview=(
            "The client is requesting transactional eCommerce capabilities (Stripe payments, "
            "order management admin dashboard, and customer accounts) on top of an informational "
            "five-page website agreement. These three additions represent substantial custom application "
            "features that fall well outside the original deliverable boundaries."
        ),
        total_findings=3,
        included_count=0,
        out_of_scope_count=3,
        uncertain_count=0,
        overall_risk_level="high",
        requires_scope_change=True,
    )

    replies = ReplyStyle(
        friendly=(
            "Hi [Client Name],\n\n"
            "Thanks for reaching out! Adding Stripe payments, an order management dashboard, "
            "and customer accounts are great ideas for expanding the platform into a complete store.\n\n"
            "Because our current agreement is focused on launching the core five-page responsive website "
            "and contact form, these eCommerce features fall outside our initial milestone. I'd love "
            "to build this for you—would you like me to put together a brief Phase 2 add-on with estimated "
            "costs [estimated additional cost] and a revised launch schedule [timeline impact] once we "
            "deliver the initial site?\n\n"
            "Best,\n[Freelancer Name]"
        ),
        professional=(
            "Hello [Client Name],\n\n"
            "Thank you for the update on the project vision. I reviewed your request regarding Stripe "
            "payments, order management, and customer accounts.\n\n"
            "Per our signed Statement of Work, the active deliverables cover a five-page informational "
            "business website, contact form, and basic SEO setup. Integrating a payment gateway, user authentication, "
            "and a backend administrative dashboard constitutes a substantial scope expansion that will "
            "require additional engineering hours and security architecture.\n\n"
            "I can draft a formal Change Order detailing the required specifications, adjusted investment "
            "[estimated additional cost], and delivery timeline [timeline impact]. Let me know if you would like "
            "me to proceed with drafting that proposal.\n\n"
            "Sincerely,\n[Freelancer Name]"
        ),
        direct=(
            "Hi [Client Name],\n\n"
            "Payment processing, order management, and user accounts are outside our original five-page "
            "website scope. I'm happy to handle them, but they will require an updated budget [estimated "
            "additional cost] and timeline [timeline impact].\n\n"
            "Shall we launch the 5-page site as agreed first, or pause to incorporate these new features into "
            "an updated contract?\n\n"
            "Regards,\n[Freelancer Name]"
        ),
    )

    return ScopeAnalysisResponse(
        id="demo-website-developer-analysis",
        project_title=PRIMARY_DEMO_SCENARIO.project_title,
        summary=summary,
        findings=findings,
        suggested_replies=replies,
        model_used="demo-verified-reference (Qwen2.5 3B Instruct)",
        analyzed_at=datetime.now(timezone.utc).isoformat(),
        is_demo=True,
    )

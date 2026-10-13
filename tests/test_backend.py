"""Unit and integration tests for ScopeGuard backend and AI parsing."""

import json
import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch

from backend.app.main import app
from backend.app.models import (
    FindingClassification,
    HealthResponse,
    ScopeAnalysisRequest,
    ScopeAnalysisResponse,
)
from backend.app.sample_data import get_verified_demo_response, PRIMARY_DEMO_SCENARIO
from backend.app.services.ollama_service import (
    OllamaConnectionError,
    OllamaModelNotFoundError,
    OllamaParsingError,
    OllamaService,
    extract_json_from_text,
)


@pytest.fixture
def client():
    return TestClient(app)


# ============================================================================
# 1. JSON Extraction and Repair Tests
# ============================================================================


def test_extract_json_clean_payload():
    raw = '{"summary": {"overview": "All good"}, "findings": []}'
    parsed = extract_json_from_text(raw)
    assert parsed["summary"]["overview"] == "All good"
    assert parsed["findings"] == []


def test_extract_json_markdown_fenced():
    raw = """Here is the result:
```json
{
  "summary": {"overview": "Scope creep detected", "requires_scope_change": true},
  "findings": []
}
```
Hope this helps!"""
    parsed = extract_json_from_text(raw)
    assert parsed["summary"]["requires_scope_change"] is True


def test_extract_json_repaired_trailing_comma():
    raw = """{
      "summary": { "overview": "Test overview", },
      "findings": [],
    }"""
    parsed = extract_json_from_text(raw)
    assert parsed["summary"]["overview"] == "Test overview"


def test_extract_json_empty_or_no_json():
    with pytest.raises(OllamaParsingError):
        extract_json_from_text("")

    with pytest.raises(OllamaParsingError):
        extract_json_from_text("Sorry, I cannot analyze this text because no scope was found.")


# ============================================================================
# 2. Scope Normalization, Classification, and Edge Cases
# ============================================================================


def test_normalize_classification_variants():
    service = OllamaService()
    req = ScopeAnalysisRequest(
        original_scope="Build a basic blog website.",
        client_request="Add social sharing buttons and also build a native iOS mobile app.",
        project_title="Blog Project",
    )

    raw_ai_data = {
        "summary": {"overview": "Mixed findings"},
        "findings": [
            {
                "id": "item-1",
                "title": "Social Sharing",
                "client_request_excerpt": "social sharing buttons",
                "original_scope_reference": "basic blog",
                "classification": "in_scope",
                "explanation": "Standard blog feature.",
                "confidence_score": 85,
                "suggested_action": "Implement as part of deliverable.",
            },
            {
                "id": "item-2",
                "title": "iOS App",
                "client_request_excerpt": "native iOS mobile app",
                "original_scope_reference": None,
                "classification": "out_of_scope",
                "explanation": "Mobile app is a separate platform.",
                "confidence_score": 98,
                "suggested_action": "Quote as separate phase.",
            },
            {
                "id": "item-3",
                "title": "Analytics Integration",
                "client_request_excerpt": "analytics",
                "original_scope_reference": None,
                "classification": "ambiguous",  # Unknown string
                "explanation": "Agreement is silent.",
                "confidence_score": 50,
                "suggested_action": "Clarify.",
            },
        ],
    }

    res = service._normalize_and_validate(raw_ai_data, req)
    assert len(res.findings) == 3
    assert res.findings[0].classification == FindingClassification.INCLUDED
    assert res.findings[1].classification == FindingClassification.POTENTIALLY_OUT_OF_SCOPE
    assert res.findings[2].classification == FindingClassification.UNCERTAIN

    assert res.summary.included_count == 1
    assert res.summary.out_of_scope_count == 1
    assert res.summary.uncertain_count == 1
    assert res.summary.requires_scope_change is True
    assert res.summary.overall_risk_level in ("moderate", "high")


def test_vague_agreements_produce_uncertain_result():
    """Verify that ambiguous agreements produce uncertain classifications rather than false accusations."""
    service = OllamaService()
    req = ScopeAnalysisRequest(
        original_scope="Provide technical advisory and basic SEO optimization for our platform.",
        client_request="Can you conduct an automated keyword audit across 40 landing pages?",
        project_title="Vague Advisory Scope",
    )

    raw_ai_data = {
        "summary": {
            "overview": "The original agreement specifies 'basic SEO optimization' without defining page limits."
        },
        "findings": [
            {
                "id": "item-1",
                "title": "40-Page Automated Keyword Audit",
                "client_request_excerpt": "automated keyword audit across 40 landing pages",
                "original_scope_reference": "basic SEO optimization",
                "classification": "uncertain",
                "explanation": (
                    "The contract phrase 'basic SEO optimization' is ambiguous. A 40-page audit may "
                    "exceed basic boundaries, but without an explicit page ceiling in the agreement, "
                    "clarification is required rather than declaring breach or out-of-scope."
                ),
                "confidence_score": 65,
                "suggested_action": "Seek clarification on page limits before commencing work.",
            }
        ],
    }

    res = service._normalize_and_validate(raw_ai_data, req)
    assert res.findings[0].classification == FindingClassification.UNCERTAIN
    assert res.summary.uncertain_count == 1
    assert res.summary.out_of_scope_count == 0
    assert "clarification" in res.findings[0].suggested_action.lower()


def test_clamp_confidence_score():
    service = OllamaService()
    req = ScopeAnalysisRequest(
        original_scope="Design a logo in vector SVG format.",
        client_request="Also design a 3D animated video intro.",
        project_title="Logo Design",
    )

    raw_ai_data = {
        "summary": {"overview": "Test"},
        "findings": [
            {
                "id": "f1",
                "title": "3D Intro",
                "client_request_excerpt": "3D animated video intro",
                "original_scope_reference": None,
                "classification": "potentially_out_of_scope",
                "explanation": "3D video is not a vector logo.",
                "confidence_score": 150,  # Out of range > 100
                "suggested_action": "New quote.",
            },
            {
                "id": "f2",
                "title": "Invalid Score Type",
                "client_request_excerpt": "test",
                "original_scope_reference": None,
                "classification": "uncertain",
                "explanation": "Test",
                "confidence_score": "not-a-number",
                "suggested_action": "Test",
            },
        ],
    }

    res = service._normalize_and_validate(raw_ai_data, req)
    assert res.findings[0].confidence_score == 100
    assert res.findings[1].confidence_score == 80


# ============================================================================
# 3. Verified Sample Scenario Demo Tests
# ============================================================================


def test_verified_demo_response_matches_specification():
    demo = get_verified_demo_response()
    assert demo.is_demo is True
    assert demo.summary.out_of_scope_count == 3
    assert demo.summary.overall_risk_level == "high"
    assert demo.summary.requires_scope_change is True

    # Check key features flagged
    titles = [f.title.lower() for f in demo.findings]
    assert any("stripe" in t or "payment" in t for t in titles)
    assert any("dashboard" in t or "order" in t for t in titles)
    assert any("account" in t or "auth" in t for t in titles)

    # Check replies contain placeholders and no invented prices
    assert "[estimated additional cost]" in demo.suggested_replies.friendly
    assert "[timeline impact]" in demo.suggested_replies.professional
    assert "$" not in demo.suggested_replies.direct  # No invented price numbers


# ============================================================================
# 4. API Endpoints Tests
# ============================================================================


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "ScopeGuard API"
    assert data["mode"] == "Local-First AI"


def test_public_config_endpoint(client):
    response = client.get("/api/config")
    assert response.status_code == 200
    data = response.json()
    assert "configured_model" in data
    assert data["local_ai"] is True
    assert data["storage"] == "in-memory (no persistence)"


def test_demo_endpoint(client):
    response = client.get("/api/demo")
    assert response.status_code == 200
    data = response.json()
    assert "primary_scenario" in data
    assert data["primary_scenario"]["id"] == PRIMARY_DEMO_SCENARIO.id
    assert "verified_sample_result" in data


def test_validation_rejects_too_short_input(client):
    response = client.post(
        "/api/analyze",
        json={"original_scope": "short", "client_request": "too short"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_analyze_handles_ollama_offline_error(client):
    with patch(
        "backend.app.services.ollama_service.OllamaService.check_health",
        new_callable=AsyncMock,
    ) as mock_health:
        mock_health.return_value = HealthResponse(
            status="offline",
            ollama_connected=False,
            ollama_url="http://localhost:11434",
            configured_model="qwen2.5:3b",
            model_available=False,
            available_models=[],
            error_message="Ollama is not running.",
            setup_command="ollama run qwen2.5:3b",
        )

        response = client.post(
            "/api/analyze",
            json={
                "original_scope": "Build a responsive five-page marketing website with contact form.",
                "client_request": "Can you also build a Stripe payment checkout flow?",
            },
        )
        assert response.status_code == 503
        data = response.json()
        assert data["error"] == "OLLAMA_OFFLINE"
        assert "ollama run" in data["setup_command"]
        assert data["can_retry"] is True

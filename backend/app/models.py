"""Data models and Pydantic schemas for ScopeGuard."""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class FindingClassification(str, Enum):
    """Classification of an individual scope finding."""
    INCLUDED = "included"
    POTENTIALLY_OUT_OF_SCOPE = "potentially_out_of_scope"
    UNCERTAIN = "uncertain"


class ScopeFinding(BaseModel):
    """Individual finding comparing client request against original scope."""
    id: str = Field(description="Unique identifier for the finding")
    title: str = Field(description="Short concise title of the item")
    client_request_excerpt: str = Field(description="Exact relevant text from the client request")
    original_scope_reference: Optional[str] = Field(
        default=None,
        description="Relevant supporting passage from original scope, if available",
    )
    classification: FindingClassification = Field(
        description="Classification: included, potentially_out_of_scope, or uncertain"
    )
    explanation: str = Field(description="Clear explanation in plain English")
    confidence_score: int = Field(
        ge=0, le=100, description="Confidence score from 0 to 100"
    )
    suggested_action: str = Field(description="Recommended practical action")

    @field_validator("confidence_score", mode="before")
    @classmethod
    def clamp_confidence(cls, v):
        try:
            val = int(v)
            return max(0, min(100, val))
        except (ValueError, TypeError):
            return 80


class ReplyStyle(BaseModel):
    """Drafted client replies in three distinct tones."""
    friendly: str = Field(description="Friendly and collaborative tone")
    professional: str = Field(description="Professional and firm tone")
    direct: str = Field(description="Short and direct tone")


class ScopeAnalysisSummary(BaseModel):
    """High-level summary of the scope comparison."""
    overview: str = Field(description="Summary of the request analysis")
    total_findings: int = Field(ge=0, description="Total number of findings")
    included_count: int = Field(ge=0, description="Count of included items")
    out_of_scope_count: int = Field(ge=0, description="Count of potentially out-of-scope items")
    uncertain_count: int = Field(ge=0, description="Count of uncertain items")
    overall_risk_level: str = Field(description="Overall risk level: low, moderate, or high")
    requires_scope_change: bool = Field(description="Whether a formal scope change or discussion is needed")


class ScopeAnalysisRequest(BaseModel):
    """Input payload for analyzing scope."""
    original_scope: str = Field(
        ...,
        min_length=10,
        max_length=25000,
        description="The original project scope, contract excerpt, or agreed deliverables",
    )
    client_request: str = Field(
        ...,
        min_length=10,
        max_length=25000,
        description="The new message, email, or feature request from the client",
    )
    project_title: Optional[str] = Field(
        default="Freelance Project",
        max_length=150,
        description="Optional title or name of the project",
    )
    freelancer_name: Optional[str] = Field(
        default=None,
        max_length=100,
        description="Optional freelancer name for drafting personalized responses",
    )
    client_name: Optional[str] = Field(
        default=None,
        max_length=100,
        description="Optional client name for personalized greetings",
    )


class ScopeAnalysisResponse(BaseModel):
    """Complete structured response returned after scope analysis."""
    id: str = Field(description="Analysis run identifier")
    project_title: str = Field(description="Project title")
    summary: ScopeAnalysisSummary = Field(description="Summary metrics and risk evaluation")
    findings: List[ScopeFinding] = Field(description="Detailed findings list")
    suggested_replies: ReplyStyle = Field(description="Three drafted client responses")
    model_used: str = Field(description="Local AI model identifier used for inference")
    analyzed_at: str = Field(description="ISO timestamp of analysis")
    is_demo: bool = Field(default=False, description="Flag indicating if sample/demo data was used")


class HealthResponse(BaseModel):
    """Ollama connectivity and service health status."""
    status: str = Field(description="Overall health: healthy, degraded, or offline")
    ollama_connected: bool = Field(description="Whether backend can reach Ollama")
    ollama_url: str = Field(description="Configured Ollama base URL")
    configured_model: str = Field(description="Configured model name")
    model_available: bool = Field(description="Whether the configured model is installed locally")
    available_models: List[str] = Field(default_factory=list, description="List of locally installed models")
    error_message: Optional[str] = Field(default=None, description="Human-readable error or setup message")
    setup_command: Optional[str] = Field(default=None, description="Exact terminal command to run to download model")


class DemoScenario(BaseModel):
    """Sample scenario definition for quick onboarding and testing."""
    id: str
    label: str
    description: str
    original_scope: str
    client_request: str
    project_title: str

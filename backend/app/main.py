"""FastAPI backend application for ScopeGuard."""

import logging
from typing import Any, Dict, List
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .models import (
    DemoScenario,
    HealthResponse,
    ScopeAnalysisRequest,
    ScopeAnalysisResponse,
)
from .sample_data import ADDITIONAL_DEMO_SCENARIOS, PRIMARY_DEMO_SCENARIO, get_verified_demo_response
from .services.ollama_service import (
    OllamaConnectionError,
    OllamaInferenceTimeoutError,
    OllamaModelNotFoundError,
    OllamaParsingError,
    OllamaServiceError,
    ollama_service,
)

# Configure logging without sensitive document content
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("scopeguard.api")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Local-First AI-Powered Freelance Scope Creep Detector API",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(OllamaConnectionError)
async def handle_ollama_connection_error(request: Request, exc: OllamaConnectionError):
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "error": "OLLAMA_OFFLINE",
            "message": exc.message,
            "setup_command": exc.setup_command,
            "configured_model": settings.OLLAMA_MODEL,
            "can_retry": True,
            "hint": (
                "Ollama is not running locally. Run 'ollama serve' in your terminal, "
                f"or download the model with '{exc.setup_command}'."
            ),
        },
    )


@app.exception_handler(OllamaModelNotFoundError)
async def handle_ollama_model_not_found_error(request: Request, exc: OllamaModelNotFoundError):
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "error": "MODEL_NOT_FOUND",
            "message": exc.message,
            "setup_command": exc.setup_command,
            "configured_model": settings.OLLAMA_MODEL,
            "can_retry": True,
            "hint": f"Run '{exc.setup_command}' in your terminal to download the required open-weight model.",
        },
    )


@app.exception_handler(OllamaInferenceTimeoutError)
async def handle_ollama_timeout_error(request: Request, exc: OllamaInferenceTimeoutError):
    return JSONResponse(
        status_code=status.HTTP_504_GATEWAY_TIMEOUT,
        content={
            "error": "INFERENCE_TIMEOUT",
            "message": exc.message,
            "setup_command": exc.setup_command,
            "configured_model": settings.OLLAMA_MODEL,
            "can_retry": True,
            "hint": "Local model took too long to generate a response. Consider testing with a smaller prompt.",
        },
    )


@app.exception_handler(OllamaParsingError)
async def handle_ollama_parsing_error(request: Request, exc: OllamaParsingError):
    return JSONResponse(
        status_code=status.HTTP_502_BAD_GATEWAY,
        content={
            "error": "MALFORMED_AI_OUTPUT",
            "message": exc.message,
            "setup_command": None,
            "configured_model": settings.OLLAMA_MODEL,
            "can_retry": True,
            "hint": "The local model generated output that did not match the required JSON schema. Please retry.",
        },
    )


@app.get("/")
async def root():
    """Root metadata endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "mode": "Local-First AI",
        "configured_model": settings.OLLAMA_MODEL,
        "status": "online",
        "docs_url": "/docs",
    }


@app.get("/api/health", response_model=HealthResponse)
async def get_health():
    """Check connectivity to Ollama and verify if the configured model is installed."""
    return await ollama_service.check_health()


@app.get("/api/config")
async def get_public_config() -> Dict[str, Any]:
    """Safe public configuration metadata without exposing server secrets."""
    return {
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "configured_model": settings.OLLAMA_MODEL,
        "max_input_chars": settings.MAX_INPUT_CHARS,
        "min_input_chars": settings.MIN_INPUT_CHARS,
        "local_ai": True,
        "storage": "in-memory (no persistence)",
    }


@app.get("/api/demo")
async def get_demo():
    """Retrieve sample scenarios and verified reference analysis for quick demo."""
    return {
        "primary_scenario": PRIMARY_DEMO_SCENARIO,
        "available_scenarios": ADDITIONAL_DEMO_SCENARIOS,
        "verified_sample_result": get_verified_demo_response(),
    }


@app.post("/api/analyze", response_model=ScopeAnalysisResponse)
async def analyze_scope(request: ScopeAnalysisRequest):
    """Analyze client request against original project scope using local open-weight AI model."""
    logger.info(
        f"Processing scope analysis request: project='{request.project_title}', "
        f"scope_len={len(request.original_scope)}, request_len={len(request.client_request)}"
    )
    result = await ollama_service.analyze(request)
    return result

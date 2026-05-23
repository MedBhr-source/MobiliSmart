"""
Health check router.
"""

from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/health")
async def health_check(request: Request):
    model_manager = request.app.state.model_manager
    return {
        "status": "healthy",
        "model_loaded": model_manager.is_loaded,
        "model_version": model_manager.model_version,
        "service": "mobilismart-ai",
    }


@router.get("/model/status")
async def model_status(request: Request):
    model_manager = request.app.state.model_manager
    return {
        "loaded": model_manager.is_loaded,
        "version": model_manager.model_version,
        "features": model_manager.feature_names,
        "accuracy": model_manager.last_accuracy,
    }

"""
Prediction router — Crowd level and ETA predictions.
"""

from fastapi import APIRouter, Request, HTTPException
from app.models.schemas import (
    CrowdPredictionRequest,
    PredictionResult,
    CrowdPredictionResponse,
    ETARequest,
    ETAResponse,
    CROWD_LABELS,
)

router = APIRouter()


@router.post("/crowd", response_model=PredictionResult)
async def predict_crowd(request: Request, body: CrowdPredictionRequest):
    """
    Predict crowd level for a given stop/line at a specific time.
    Returns a level from 1 (empty) to 5 (packed) with confidence score.
    """
    model_manager = request.app.state.model_manager

    try:
        prediction = model_manager.predict_crowd(
            stop_id=body.stop_id,
            line_id=body.line_id,
            day_of_week=body.day_of_week,
            hour=body.hour,
            month=body.month,
        )

        return PredictionResult(
            predictions=[
                CrowdPredictionResponse(
                    predicted_level=prediction["level"],
                    confidence=prediction["confidence"],
                    label=CROWD_LABELS.get(prediction["level"], "Inconnu"),
                    stop_id=body.stop_id,
                    line_id=body.line_id,
                )
            ],
            model_version=model_manager.model_version,
            source="ai_model",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@router.post("/eta", response_model=ETAResponse)
async def predict_eta(request: Request, body: ETARequest):
    """
    Estimate travel time between two points.
    """
    model_manager = request.app.state.model_manager

    try:
        result = model_manager.predict_eta(
            origin_lat=body.origin_lat,
            origin_lng=body.origin_lng,
            dest_lat=body.destination_lat,
            dest_lng=body.destination_lng,
            mode=body.mode,
            day_of_week=body.day_of_week,
            hour=body.hour,
        )
        return ETAResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ETA error: {str(e)}")

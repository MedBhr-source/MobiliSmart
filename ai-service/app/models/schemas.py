"""
Pydantic schemas for prediction requests and responses.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import IntEnum


class CrowdLevel(IntEnum):
    EMPTY = 1
    LOW = 2
    MODERATE = 3
    HIGH = 4
    PACKED = 5


CROWD_LABELS = {
    1: "Vide",
    2: "Peu fréquenté",
    3: "Modéré",
    4: "Fréquenté",
    5: "Bondé",
}


class CrowdPredictionRequest(BaseModel):
    stop_id: Optional[int] = None
    line_id: Optional[int] = None
    day_of_week: int = Field(..., ge=0, le=6, description="0=Sunday, 6=Saturday")
    hour: int = Field(..., ge=0, le=23)
    month: int = Field(default=1, ge=1, le=12)


class CrowdPredictionResponse(BaseModel):
    predicted_level: int
    confidence: float
    label: str
    stop_id: Optional[int] = None
    line_id: Optional[int] = None


class PredictionResult(BaseModel):
    predictions: List[CrowdPredictionResponse]
    model_version: str = "v1.0"
    source: str = "ai_model"


class ETARequest(BaseModel):
    origin_lat: float
    origin_lng: float
    destination_lat: float
    destination_lng: float
    mode: str = "transit"
    day_of_week: int = Field(default=1, ge=0, le=6)
    hour: int = Field(default=12, ge=0, le=23)


class ETAResponse(BaseModel):
    estimated_seconds: int
    confidence: float
    delay_probability: float
    mode: str

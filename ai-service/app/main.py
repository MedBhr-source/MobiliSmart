"""
Mobilismart AI Service — FastAPI Application
Crowd prediction and ETA estimation using ML models.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routers import prediction, health
from app.services.model_manager import ModelManager

model_manager = ModelManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML models on startup."""
    model_manager.load_models()
    app.state.model_manager = model_manager
    yield
    # Cleanup on shutdown
    model_manager.cleanup()


app = FastAPI(
    title="Mobilismart AI Service",
    description="Service d'intelligence artificielle pour la prédiction d'affluence dans les transports urbains",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(prediction.router, prefix="/predict", tags=["Predictions"])
app.include_router(health.router, tags=["Health"])


@app.get("/")
async def root():
    return {
        "service": "Mobilismart AI",
        "version": "1.0.0",
        "status": "operational",
    }

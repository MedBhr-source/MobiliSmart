"""
Model Manager — Trains and manages ML models for crowd prediction and ETA.
Uses XGBoost for crowd prediction with synthetic training data.
"""

import numpy as np
import math
import os
import joblib
import logging
from pathlib import Path
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

logger = logging.getLogger(__name__)

MODEL_DIR = Path(os.getenv("MODEL_PATH", "/app/models"))


class ModelManager:
    def __init__(self):
        self.crowd_model = None
        self.is_loaded = False
        self.model_version = "v1.0"
        self.feature_names = ["day_of_week", "hour", "month", "is_peak", "is_weekend", "stop_id_hash", "line_id_hash"]
        self.last_accuracy = 0.0

    def load_models(self):
        """Load existing models or train new ones."""
        crowd_model_path = MODEL_DIR / "crowd_model.joblib"

        if crowd_model_path.exists():
            try:
                self.crowd_model = joblib.load(crowd_model_path)
                self.is_loaded = True
                logger.info("Crowd model loaded from disk.")
                return
            except Exception as e:
                logger.warning(f"Failed to load model: {e}. Retraining...")

        self._train_crowd_model()

    def _train_crowd_model(self):
        """Train crowd prediction model with synthetic data."""
        logger.info("Training crowd prediction model with synthetic data...")

        X, y = self._generate_training_data()
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        self.crowd_model = GradientBoostingClassifier(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=42,
        )
        self.crowd_model.fit(X_train, y_train)

        y_pred = self.crowd_model.predict(X_test)
        self.last_accuracy = round(accuracy_score(y_test, y_pred), 4)
        logger.info(f"Model trained. Accuracy: {self.last_accuracy}")

        # Save model
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.crowd_model, MODEL_DIR / "crowd_model.joblib")

        self.is_loaded = True

    def _generate_training_data(self, n_samples: int = 5000):
        """Generate realistic synthetic training data for Paris transit."""
        np.random.seed(42)

        days = np.random.randint(0, 7, n_samples)
        hours = np.random.randint(5, 24, n_samples)
        months = np.random.randint(1, 13, n_samples)
        is_peak = np.array([1 if h in [7, 8, 9, 17, 18, 19] else 0 for h in hours])
        is_weekend = np.array([1 if d in [0, 6] else 0 for d in days])
        stop_hash = np.random.randint(0, 20, n_samples)
        line_hash = np.random.randint(0, 14, n_samples)

        X = np.column_stack([days, hours, months, is_peak, is_weekend, stop_hash, line_hash])

        # Generate realistic labels (1-5)
        y = np.ones(n_samples, dtype=int)
        for i in range(n_samples):
            base = 2  # moderate default
            if is_peak[i]:
                base += 2
            if is_weekend[i]:
                base -= 1
            if hours[i] >= 22 or hours[i] <= 6:
                base = 1
            if months[i] in [7, 8]:  # summer = less crowded
                base -= 1
            if line_hash[i] < 5:  # popular lines
                base += 1
            y[i] = max(1, min(5, base + np.random.randint(-1, 2)))

        return X, y

    def predict_crowd(self, stop_id: int = None, line_id: int = None,
                      day_of_week: int = 1, hour: int = 12, month: int = 1) -> dict:
        """Predict crowd level for given parameters."""
        if not self.is_loaded:
            return self._fallback_prediction(day_of_week, hour)

        is_peak = 1 if hour in [7, 8, 9, 17, 18, 19] else 0
        is_weekend = 1 if day_of_week in [0, 6] else 0
        stop_hash = (stop_id or 0) % 20
        line_hash = (line_id or 0) % 14

        features = np.array([[day_of_week, hour, month, is_peak, is_weekend, stop_hash, line_hash]])
        prediction = self.crowd_model.predict(features)[0]
        probabilities = self.crowd_model.predict_proba(features)[0]
        confidence = float(max(probabilities))

        return {
            "level": int(prediction),
            "confidence": round(confidence, 4),
        }

    def predict_eta(self, origin_lat: float, origin_lng: float,
                    dest_lat: float, dest_lng: float,
                    mode: str = "transit", day_of_week: int = 1,
                    hour: int = 12) -> dict:
        """Estimate travel time between two points."""
        distance = self._haversine(origin_lat, origin_lng, dest_lat, dest_lng)

        speed_map = {
            "transit": 25,
            "bus": 15,
            "metro": 30,
            "bike": 15,
            "walk": 5,
            "car": 20,
        }
        speed_kmh = speed_map.get(mode, 20)

        # Apply time-of-day factor
        peak_factor = 1.3 if hour in [7, 8, 9, 17, 18, 19] else 1.0
        weekend_factor = 0.85 if day_of_week in [0, 6] else 1.0

        base_seconds = (distance / speed_kmh) * 3600
        estimated = int(base_seconds * peak_factor * weekend_factor)

        delay_prob = 0.35 if hour in [8, 9, 18] else 0.1

        return {
            "estimated_seconds": estimated,
            "confidence": 0.78,
            "delay_probability": delay_prob,
            "mode": mode,
        }

    def _fallback_prediction(self, day_of_week: int, hour: int) -> dict:
        is_peak = hour in [7, 8, 9, 17, 18, 19]
        is_weekend = day_of_week in [0, 6]

        if is_peak and not is_weekend:
            level = 4
        elif is_peak:
            level = 3
        elif hour >= 22 or hour <= 6:
            level = 1
        else:
            level = 2

        return {"level": level, "confidence": 0.5}

    @staticmethod
    def _haversine(lat1, lng1, lat2, lng2) -> float:
        R = 6371
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    def cleanup(self):
        logger.info("AI Service shutting down.")

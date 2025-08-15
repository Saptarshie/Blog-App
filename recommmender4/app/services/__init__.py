# app/services/__init__.py
# Export the three core functions so callers can do:
#   from app.services import fetch_vectors, sample_candidates, rank_cosine
from .recommend_service import (
    fetch_vectors,
    sample_candidates,
    rank_cosine,
)

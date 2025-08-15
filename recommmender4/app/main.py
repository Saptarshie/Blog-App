from fastapi import FastAPI, BackgroundTasks, HTTPException
from .schemas import (
    RecommendRequest, RecommendResponse,
    CreateVectorRequest, CreateVectorResponse
)
from .services import fetch_vectors, sample_candidates, rank_cosine
from .services.task_queue import create_vector_task
from .config import Settings

from celery import Celery
# app = FastAPI()
settings = Settings()


app = FastAPI()


@app.post("/recommend", response_model=RecommendResponse)
async def recommend(req: RecommendRequest):
    k = req.k or settings.RECOMMEND_K
    pool = req.candidate_pool_size or settings.CANDIDATE_POOL_SIZE
    qs = await fetch_vectors(req.blog_ids)
    cands = await sample_candidates(req.blog_ids, pool)
    if not cands:
        raise HTTPException(404, "No candidates found")
    recs = rank_cosine(qs, cands, k)
    return RecommendResponse(recommended_ids=recs)


@app.post("/vector", response_model=CreateVectorResponse)
async def create_vector(req: CreateVectorRequest):
    # Enqueue the embedding job
    print(req)
    task = create_vector_task.delay(req.model_dump())
    print(task)
    return CreateVectorResponse(task_id=task.id)

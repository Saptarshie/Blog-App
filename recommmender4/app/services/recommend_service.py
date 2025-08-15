import numpy as np
from bson import ObjectId
from ..utils import logger
from ..database import get_db
db = get_db()
blogvectors = db["blogvectors4"]

async def fetch_vectors(ids: list[str]) -> list[np.ndarray]:
    cursor = blogvectors.find({"blog_id": {"$in": ids}}, {"vector": 1})
    docs = await cursor.to_list(length=len(ids))
    if len(docs) != len(ids):
        missing = set(ids) - {d["blog_id"] for d in docs}
        raise ValueError(f"Missing vectors for: {missing}")
    return [np.array(d["vector"], dtype=float) for d in docs]

async def sample_candidates(exclude_ids: list[str], n: int) -> list[dict]:
    pipeline = [
        {"$match": {"blog_id": {"$nin": exclude_ids}}},
        {"$sample": {"size": n}},
        {"$project": {"blog_id": 1, "vector": 1}}
    ]
    return await blogvectors.aggregate(pipeline).to_list(length=n)

def rank_cosine(query_vecs: list[np.ndarray], candidates: list[dict], k: int) -> list[str]:
    profile = np.mean(np.stack(query_vecs), axis=0)
    cand_mat = np.stack([np.array(c["vector"], dtype=float) for c in candidates])
    p_norm = profile / np.linalg.norm(profile)
    c_norms = cand_mat / np.linalg.norm(cand_mat, axis=1, keepdims=True)
    
    sims = c_norms.dot(p_norm)
    idx = np.argsort(sims)[-k:][::-1]
    return [candidates[i]["blog_id"] for i in idx]
from pydantic import BaseModel
from typing import List

class RecommendRequest(BaseModel):
    blog_ids: List[str]
    k: int = None
    candidate_pool_size: int = None

class RecommendResponse(BaseModel):
    recommended_ids: List[str]
    
# New DTOs for vector creation
class CreateVectorRequest(BaseModel):
    blog_id: str
    title: str
    description: str
    content: str
    tags: List[str]
    author: str

class CreateVectorResponse(BaseModel):
    # success: bool
    task_id: str
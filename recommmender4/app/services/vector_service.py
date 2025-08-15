
import numpy as np
from ..utils import logger
from .compute_embedding import embed
def compute_embedding(text: str) -> list[float]:
    # Replace with real embedding logic (OpenAI/HuggingFace, etc.)
    print("Computing embedding for text:", text)
    # return np.random.randn(768).tolist()
    return embed(text=text)

# Modify upsert_vector to get a new database connection
async def upsert_vector(blog_id: str, text: str):
    vector = compute_embedding(text)
    from ..database import get_db
    db = get_db()
    blogvectors = db["blogvectors4"]
    
    # Check and create index if needed
    try:
        indexes = await blogvectors.index_information()
        if "blog_id" not in indexes:
            await blogvectors.create_index("blog_id", unique=True)
    except Exception as e:
        logger.error(f"Index check failed: {e}")
        # Recreate index if check fails
        await blogvectors.create_index("blog_id", unique=True)

    # Upsert the vector into the database    
    try:
        await blogvectors.update_one(
            {"blog_id": blog_id},
            {"$set": {"blog_id": blog_id,"vector": vector}},
            upsert=True
        )
        logger.info(f"Vector saved for {blog_id}")
    except Exception as e:
        logger.error(f"Vector save failed: {e}")
        raise

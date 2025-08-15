from pydantic import BaseModel, Field, field_validator, field_serializer
from bson import ObjectId
from typing import List
from pydantic_core import core_schema

class PyObjectId(ObjectId):
    pass


class BlogModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    vector: List[float]
    
    @field_serializer('id')
    def serialize_id(self, id: PyObjectId, _info):
        return str(id)

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }

class BlogVectorModel(BaseModel):
    Blog_id: str
    vector: List[float]
    
    model_config = {
        "arbitrary_types_allowed": True
    }

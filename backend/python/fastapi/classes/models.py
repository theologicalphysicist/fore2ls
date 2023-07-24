import pydantic
from typing import Optional, Any


class RequestTokens(pydantic.BaseModel):
    date: str
    method: str
    query: dict
    path: str
    body: Optional[dict]
    params: Optional[dict]


class ResponseTokens(pydantic.BaseModel):
    status: int
    length: Optional[int]
    responseTime: int
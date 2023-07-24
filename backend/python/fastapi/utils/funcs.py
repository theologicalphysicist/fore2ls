import json

from starlette.responses import StreamingResponse


async def parseResponse(response: StreamingResponse) -> str:
    RES_BODY = [chunk async for chunk in response.body_iterator]
    return json.loads((b"".join(RES_BODY)).decode("utf-8"))
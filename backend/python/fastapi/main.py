import os, sys, json, datetime, time

from fastapi import (
    FastAPI,
    Request
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

#_ LOCAL
from utils.logger import Verbal
from utils.funcs import parseResponse

from classes.models import RequestTokens, ResponseTokens


#_ APP CONFIG
APP = FastAPI(debug=True, title="⚡️SERVER⚡️", version="1.0.0")
APP_LOGGER = Verbal("⚡️SERVER")


#_ APP MIDDLEWARE
@APP.middleware("http")
async def request_logging(req: Request, call_next):
    #* request log
    NOW = datetime.datetime.now()
    REQUEST_TOKENS = RequestTokens(
        date=NOW.ctime(),
        method=req.method,
        path=str(req.url),
        query=dict(req.query_params),
        body=dict(await req.json()),
        params=req.path_params
    )
    APP_LOGGER.request(REQUEST_TOKENS)

    #* response log
    START = time.time()
    RES = await parseResponse(await call_next(req))
    RESPONSE_TOKENS = ResponseTokens(
        status=RES["status"],
        length=len(json.dumps(RES)),
        responseTime=round((time.time() - START) * 1000, None)
    )
    APP_LOGGER.response(RESPONSE_TOKENS)

    return JSONResponse(
        RES,
        status_code=RES["status"]
    )
#TODO: ADD CORS MIDDLEWARE


#_ ROUTES
@APP.get("/")
def home(req: Request):

    return {
        "body": {
            "no": "aether"
        },
        "status": 200,
    }

@APP.get("/logger_test")
def logger_test(req: Request):
    APP_LOGGER.info({
        "info": "TEST"
    })
    APP_LOGGER.warning("info")
    APP_LOGGER.debug("testing")
    APP_LOGGER.error(["test", "list"])

    return {
        "body": True,
        "status": 200
    }
#TODO: ADD ERROR HANDLING
#TODO: INCLUDE SAME ERROR & RESPONSE FORMAT AS IN JS/TS BACKENDS
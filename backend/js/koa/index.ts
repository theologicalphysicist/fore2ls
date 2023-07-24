import Koa from "koa";
import Router from "koa-router";

//_ MIDDLEWARE IMPORTS
import cors from "@koa/cors";
import { bodyParser } from "@koa/bodyparser";
import serve from "koa-static";

//_ LOCAL
import { ErrorMessage, RequestTokens, ResponseMessage, ResponseTokens } from "./utils/types.js";
import { RequestLog, ResponseLog, Verbal } from "./utils/logger.js";
import { checkEnvironment } from "./utils/funcs.js";


const APP: Koa = new Koa();
const APP_ROUTER = new Router();

const SERVER_LOGGER = new Verbal("⚡️");


//_ MIDDLEWARE
APP.use(cors());
APP.use(bodyParser());
APP.use(serve("public", {index: false}));
APP.use(async (ctx: Koa.Context, next: Koa.Next) => {//* custom logger
    const START = new Date().getTime();
    const REQUEST_TOKENS: RequestTokens = {
        method: ctx.request.method,
        path: ctx.request.path,
        date: new Date().toLocaleString(),
        body: ctx.request.body,
        query: {...ctx.request.query},
        params: ctx.params ?? {},
        length: ctx.request.length,
        type: ctx.request.type
    };

    RequestLog(REQUEST_TOKENS);

    await next().then(() => {
            const END = new Date().getTime();
            const RESPONSE_TOKENS: ResponseTokens = {
                status: ctx.response.status,
                length: ctx.response.length,
                responseTime: END - START
            };

            ResponseLog(RESPONSE_TOKENS);

        });
});


//_ ROUTES
APP_ROUTER.get("Home", "/", (ctx: Koa.Context, next: Koa.Next) => {
    SERVER_LOGGER.InfoLog("IN ROUTE HANDLER");

    ctx.send(200, {
        otherURL: ctx.request.URL
    }, ctx.response);
});


//_ CONFIG
APP.silent = !checkEnvironment(); //* don't write logs if app is in dev/prod
APP.use(APP_ROUTER.routes());

//_ CONTEXT EDITING
APP.context.send = (code: number, body: string | ResponseMessage | object, res: Koa.Response & {body: unknown}) => {
    res.status = code;
    res.body = body;
};

//_ ERROR HANDLING
APP.on("error", (err: ErrorMessage, ctx: Koa.Context) => {
    SERVER_LOGGER.ErrorLog(ctx);

    ctx.send(err.code || 500, err, ctx.response);
});


APP.listen(parseInt(process.env.PORT || "3000"), undefined, undefined, () => {
    SERVER_LOGGER.InfoLog(`server running on port ${process.env.PORT || 3000}`);
});
/*
    ! CAN ADD PROPERTIES & METHODS TO APP.ctx by APP.context.<> = <INSERT FUNC/PROP HERE>. 
    ! Will be useful for custom middleware 
*/
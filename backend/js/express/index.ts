import express, {Express, NextFunction, Response, Request} from "express";

//_ MIDDLEWARE IMPORTS
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan, {TokenIndexer} from "morgan";
import session from "express-session";

import { Verbal, RequestLog, ResponseLog } from "./utils/logger.js";
import { ErrorMessage } from "./utils/types.js";

const APP: Express = express();
const SERVER_LOGGER = new Verbal("⚡️[SERVER]");

//_ MIDDLEWARE
APP.use(cors());
//_ MORGAN LOGGING
APP.use(morgan((tokens: TokenIndexer<Request, Response>, req: Request, res: Response) => RequestLog(tokens, req, res), {
    skip: (req: Request, res: Response) => false,
    immediate: true
}));
APP.use(morgan((tokens: TokenIndexer<Request, Response>, req: Request, res: Response) => ResponseLog(tokens, req, res), {
    skip: (req: Request, res: Response) => false,
    immediate: false
}));
APP.use(express.static("./public"));
APP.use(bodyParser.json());
APP.use(cookieParser());
//TODO: INSERT SESSION STORE HERE


//_ ROUTES
APP.get("/",async (req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        response: "request received"
    });
});


//_ ROUTERS
//TODO: ADD ROUTERS HERE


//_ CONFIG
//_ ERROR HANDLING
APP.use((err: ErrorMessage, req: Request, res: Response, next: NextFunction) => {
    SERVER_LOGGER.ErrorLog(err);

    res.status(err.code ?? 500).json(err);
});


APP.listen(process.env.PORT, () => {
    SERVER_LOGGER.InfoLog(`server is running at http://localhost:${process.env.PORT}`);
});


//! AXIOS ALREADY INSTALLED AS HTTP CLIENT
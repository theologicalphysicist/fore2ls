import { ErrorMessage } from "./types.js";
import project_package from "../package.json" assert {type: "json"};


//_ ERRORS
export const ERROR_CODES = new Map([
    [400, "Bad Request".toUpperCase()],
    [401, "Unauthorized".toUpperCase()],
    [402, "Payment Requires".toUpperCase()],
    [403, "Forbidden".toUpperCase()],
    [404, "Not Found".toUpperCase()],
    [405, "Method Not Allowed".toUpperCase()],
    [406, "Not Acceptable".toUpperCase()],
    [407, "Proxy Authentication Required".toUpperCase()],
    [408, "Request Timeout".toUpperCase()],
    [409, "Conflict".toUpperCase()],
    [410, "Gone".toUpperCase()],
    [411, "Length Required".toUpperCase()],
    [412, "Precondition Failed".toUpperCase()],
    [413, "Payload Too Large".toUpperCase()],
    [414, "URI Too Long".toUpperCase()],
    [415, "Unsupported Media Type".toUpperCase()],
    [416, "Range Not Satisfiable".toUpperCase()],
    [417, "Expectation Failed".toUpperCase()],
    [418, "I'm a teapot".toUpperCase()],
    [421, "Misdirected Request".toUpperCase()],
    [422, "Unprocessable Content".toUpperCase()],
    [423, "Locked".toUpperCase()],
    [424, "Failed Dependency ".toUpperCase()],
    [425, "Too Early ".toUpperCase()],
    [426, "Upgrade Required".toUpperCase()],
    [428, "Precondition Required".toUpperCase()],
    [429, "Too Many Requests".toUpperCase()],
    [431, "Request Header Fields Too Large".toUpperCase()],
    [451, "Unavailable For Legal Reasons".toUpperCase()],
    [500, "Internal Server Error".toUpperCase()],
    [501, "Not Implemented".toUpperCase()],
    [502, "Bad Gateway".toUpperCase()],
    [503, "Service Unavailable".toUpperCase()],
    [504, "Gateway Timeout".toUpperCase()],
    [505, "HTTP Version Not Supported".toUpperCase()],
    [506, "Variant Also Negotiates".toUpperCase()],
    [507, "Insufficient Storage ".toUpperCase()],
    [508, "Loop Detected".toUpperCase()],
    [510, "Not Extended".toUpperCase()],
    [511, "Network Authentication Required".toUpperCase()]
]);

export const GENERIC_ERROR_MESSAGE: ErrorMessage = {
    code: 500,
    present: true,
    error: ERROR_CODES.get(500) ?? "INTERNAL SERVER ERROR",
    details: `an unknown error has occurred. if this persists, report to ${project_package.bugs.url} with the 'bug' tag.`
};
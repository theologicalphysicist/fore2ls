import test, {} from "node:test";
import assert from "node:assert";
import * as crypto from "node:crypto";

//_ TEST CODE
import { Verbal } from "../logger.ts"

const TEST_LOGGER: Verbal = new Verbal("TEST", true);

TEST_LOGGER.log("test 1");
// TEST_LOGGER.log({
//     "noa": "ether"
// });
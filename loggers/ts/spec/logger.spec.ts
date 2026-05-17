import test from "node:test";
import assert from "node:assert";

//_ TEST CODE
import { Verbal, Levels } from "../logger.js"

const TEST_LOGGER: Verbal = new Verbal(undefined, Levels.DEBUG, {source: "spec"});


test("test debug logging", () => {
    TEST_LOGGER.debug("test 1");
    TEST_LOGGER.debug({test: 1});
});

test("test trace logging", () => {
    TEST_LOGGER.trace("test trace");
    TEST_LOGGER.trace({test: "trace"});
});

test("test info logging", () => {
    TEST_LOGGER.info("test 2");
    TEST_LOGGER.info({test: 2});
});

test("test warning logging", () => {
    TEST_LOGGER.warning("test 3");
    TEST_LOGGER.warning({test: 3});
});

test("test warn logging alias", () => {
    TEST_LOGGER.warn("test warn");
    TEST_LOGGER.warn({test: "warn"});
});

test("test error logging", () => {
    TEST_LOGGER.error("test 4");
    TEST_LOGGER.error({test: 4});
});

test("test critical logging", () => {
    TEST_LOGGER.critical("test 5");
    TEST_LOGGER.critical({test: 5});
});
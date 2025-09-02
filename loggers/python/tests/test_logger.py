import unittest

#_ LOCAL
import logger


class TestLogger(unittest.TestCase):
    """
    Unit tests for the Verbal logger.
    """
    TEST_DATA = {
        "str": "This is a message",
        "dict": {
            "int": 15,
            "float": 3.14,
            "complex": 1 + 2j
        },
        "none": None,
        "list": [7, "eight", True, False, 1.618033988749895],
        "set": {1, 2, 3},
        "frozenset": frozenset([4, 5, 6]),
        "tuple": (1, 2, 3),
        "bytes": b"byte string",
        "bytearray": bytearray(b"byte array"),
        "type": type("This is a string"),
        "exception": Exception("This is an exception"),
        "known_exception": TypeError("str object is not callable"),
        "datetime": logger.datetime.now(),
    }


    def setUp(self):
        """
        Set up the test case.
        """
        self.json_logger = logger.Verbal(config=logger.Config.JSON, framework=None, name="test_logger_json", level=logger.Levels.NOTSET)
        self.yaml_logger = logger.Verbal(config=logger.Config.YAML, framework=None, name="test_logger_yaml", level=logger.Levels.NOTSET)


    def test_logger_initialization(self):
        """
        Test logger initialization.
        """
        # self.assertIsInstance(self.logger, Verbal)
        # self.assertEqual(self.logger.name, "test_logger")
        # self.assertEqual(self.logger.framework, None)
        # self.assertEqual(self.logger.config, Config.JSON.value)

    
    def test_logger_json(self):
        """
            Test the Verbal logger functionality with JSON config.
        """

        NOTSET_LOG = self.json_logger.log(data=self.TEST_DATA, level=logger.Levels.NOTSET)
        TRACE_LOG = self.json_logger.trace(self.TEST_DATA)
        DEBUG_LOG = self.json_logger.debug(self.TEST_DATA)
        INFO_LOG = self.json_logger.info(self.TEST_DATA)
        WARNING_LOG = self.json_logger.warning(self.TEST_DATA)
        ERROR_LOG = self.json_logger.error(self.TEST_DATA)
        CRITICAL_LOG = self.json_logger.critical(self.TEST_DATA)

    
    @unittest.skip("skipping YAML logger test for now")
    def test_logger_yaml(self):
        """
            Test the Verbal logger functionality with YAML config.
        """

        self.yaml_logger.log(data=self.TEST_DATA, level=logger.Levels.NOTSET)
        self.yaml_logger.trace(self.TEST_DATA)
        self.yaml_logger.debug(self.TEST_DATA)
        self.yaml_logger.info(self.TEST_DATA)
        self.yaml_logger.warning(self.TEST_DATA)
        self.yaml_logger.error(self.TEST_DATA)
        self.yaml_logger.critical(self.TEST_DATA)


if __name__ == "__main__":
    unittest.main()

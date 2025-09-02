import json
import os
from enum import Enum
from typing import Union, Any
from datetime import datetime

#_ THIRD PARTY
import yaml
from starlette.requests import Request
from starlette.responses import Response
from dotenv import load_dotenv
from yachalk import chalk


class Levels(Enum):
    """
        Enum for logging levels.
        Used to define the level of logging.
    """
    NOTSET = 0
    TRACE = 1
    DEBUG = 2
    INFO = 3
    WARNING = 4
    ERROR = 5
    CRITICAL = 6


class Config(Enum):
    JSON = "json"
    YAML = "yaml"
    TOML = "toml"


#_ CUSTOM LOGGER
class Verbal:
    """
        Verbal logger for logging data in a human-readable format.

        This logger is designed to be used in development environments where
        human-readable logs are preferred over structured logs.
        
        It supports different logging levels and can be extended to support
        different frameworks.
    """
    #_ ATTRIBUTES
    framework: str
    name: str
    config: str
    level: int
    COLORS: dict = {
        "purple": "#D290E3",
        "white": "#E7E7E7",
        "cyan": "#66C2CD",
        "green": "#A3D18D",
        "orange": "#EB8B59",
        "yellow": "#DBCB79",
        "blue": "#71BEF2",
        "red": "#E88388",
    }
    SERVER_COLORS: dict = {
        "request": "#EF596F",
        "response": "#61AFEF"
    }
    LOG_TITLE_MAP: dict = {
        Levels.NOTSET.value: "#D290E3",
        Levels.TRACE.value: "#E7E7E7",
        Levels.DEBUG.value: "#66C2CD",
        Levels.INFO.value: "#A3D18D",
        Levels.WARNING.value: "#EB8B59",
        Levels.ERROR.value: "#E88388",
        Levels.CRITICAL.value: "#000",
    }
    SIMPLE_TYPES: tuple = (str, int, float, bool, complex, type(None), bytes, bytearray)
    COMPLEX_TYPES: tuple = (list, dict, set, frozenset, tuple)


    #_ CONSTRUCTORS
    def __init__(self, level: Levels = Levels.NOTSET.value, framework: str = None, name: str = "verbal", config: Config = Config.JSON.value) -> None:
        """
            Initialize the Verbal logger.

            PARAMS:
                level (Levels) - the level of logging, must be an integer from 0 to 6.
                framework (str) - the framework being used, can be None if not applicable.
                name (str) - the name of the logger, defaults to "verbal".
        """
        self.config = config
        self.framework = framework
        self.name = name
        self.level = level

        load_dotenv(".logger.env", verbose=True)
    

    def __str__(self) -> str:
        return f"Verbal Logger called: {self.name}"


    def __repr__(self) -> str:
        return f"Verbal(name={self.name}, framework={self.framework})"
    

    def _serealizer(self, data):
        """
            Serialize data to an outputtable format.
            This method is used to convert data into a format that can be easily logged or printed.

            PARAMS:
                data (any) - the data to be serialized, can be any type.

            RETURNS:
                the serialized data.
        """
        if isinstance(data, Exception):
            return data.__dict__ if hasattr(data, '__dict__') else repr(data)
        elif isinstance(data, datetime):
            return data.strftime("%Y-%m-%d %H:%M:%S")
        elif isinstance(data, type):
            return data.__name__ if hasattr(data, '__name__') else str(data)
        else:
            raise Exception(f"unsupported data type for serialization: {type(data)}")


    def _log(self, level: Levels, data) -> None:
        """
            Log data at a specific level.

            PARAMS:
                level (str) - the level of logging dictated by the Levels Enum.
                data (any) - the data to be logged, can be any type.
        """


        def get_log_title(level: Levels) -> str:
            """
                Get the title for the log output.

                PARAMS:
                    level (str) - the level of logging, defined by the Levels Enum.

                RETURNS:
                    str - the title for the log output.
            """
            return f"{chalk.bg_hex(self.LOG_TITLE_MAP[level]).hex('#000' if level != Levels.CRITICAL.value else "#fff").bold(' ' + level + ' ')}"


        def get_log_name(level: Levels) -> str:
            """
                Get the name for the log output.

                PARAMS:
                    level (str) - the level of logging, defined by the Levels Enum.

                RETURNS:
                    str - the name for the log output.
            """
            return f"{chalk.hex(self.LOG_TITLE_MAP[level]).underline(self.name)}"


        if isinstance(data, self.SIMPLE_TYPES):
            OUT = data
        else:
            OUT = json.dumps(data, indent=3, )
    
        return print(
            "\n" + get_log_title(level) +
            " - " +
            get_log_name(level) + ": " +
            f"{OUT}" + "\n"
        )
    
    
    #_ GENERAL LOGGING
    def trace(self, data: Any) -> None:
        """
            Log data at the TRACE level.

            PARAMS:
                data (any) - the data to be logged, can be any type.
        """
        
        if self.level < Levels.TRACE.value: return None

        return self._log(Levels.TRACE, data)


    def debug(self, data: Any) -> None:
        """
            Log data at the DEBUG level.

            PARAMS:
                data (any) - the data to be logged, can be any type.
        """
        
        if self.level < Levels.DEBUG.value: return None

        return self._log(Levels.DEBUG, data)
    

    def info(self, data: Any) -> None:
        """
            Log data at the INFO level.

            PARAMS:
                data (any) - the data to be logged, can be any type.
        """
        
        if self.level < Levels.INFO.value: return None

        return self._log(Levels.INFO, data)

    

    def warning(self, data: Any) -> None:
        """
            Log data at the WARNING level.

            PARAMS:
                data (any) - the data to be logged, can be any type.
        """
        
        if self.level < Levels.WARNING.value: return None

        return self._log(Levels.WARNING, data)
    

    warn = warning  #* Alias for warning logging level
    

    def error(self, data: Any) -> None:
        """
            Log data at the ERROR level.

            PARAMS:
                data (any) - the data to be logged, can be any type.
        """
        
        if self.level < Levels.ERROR.value: return None

        return self._log(Levels.ERROR, data)
    

    def critical(self, data: Any) -> None:
        """
            Log data at the CRITICAL level.

            PARAMS:
                data (any) - the data to be logged, can be any type.
        """
        
        if self.level < Levels.CRITICAL.value: return None

        return self._log(Levels.CRITICAL, data)
    

    fatal = critical  #* Alias for critical logging level
    

    #_ BACKEND LOGGING
    def request(self, req: Request) -> None:
        """
            print out request details when request is received at server.

            NOTE: self.framework must be defined, otherwise nothing will be printed.

            PARAMS: 
                tokens (any) - object containing data to be printed. will vary by framework.
        """
        QUERY = json.dumps(req.query_params, indent=2)
        # BODY = json.dumps(req.body, indent=2)
        PARAMS = json.dumps(req.path_params, indent=2)

        if (self.framework == "fastapi"): #TODO: Create ENUM for possible frameworks (i.e., lambda vs fastapi)
            return print(
                "\n" + f"{chalk.bg_hex(self.serverColors['request']).hex('#000').bold(' REQUEST ')}" + "\n" +
                f"{chalk.bold(req.method)} {chalk.underline(req.path)}, date:{chalk.italic(req.date)}" + "\n" +
                f"query: {chalk.hex(self.serverColors['request'])(QUERY)}" + "\n" +
                # f"body: {chalk.hex(self.serverColors['request'])(BODY)}" + "\n" +
                f"params: {chalk.hex(self.serverColors['request'])(PARAMS)}" + "\n"
            )
        elif (self.framework == "lambda"):
            return print(
                "\n"
            )
    

    def response(self, res: Response) -> None:

        if (self.framework == "fastapi"):
            return print(
                "\n" + f"{chalk.bg_hex(self.serverColors['response']).hex('#000').bold(' RESPONSE ')}" + "\n" +
                f"status:{chalk.hex(self.serverColors['response']).bold(res.status)}, content length:{chalk.underline(res.length)}, response time:{chalk.bold(str(res.responseTime) + 'ms')}" + "\n"
            )
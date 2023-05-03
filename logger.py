import logging, pprint
from decouple import config

from stackapi import StackAPI
import github

#_ CUSTOM LOGGER
LOGGING_COLORS = {
    "red": {
        "foreground": "\033[91m",
        "background": "\033[101m" 
    },
    "dark_red": {
        "foreground": "\033[31m",
        "background": "\033[41m"
    },
    "orange": {
        "foreground": "\033[93m",
        "background": "\033[103m"
    },
    "dark_yellow": {
        "foreground": "\033[33m",
        "background": "\033[43m"
    },
    "cyan": {
        "foreground": "\033[96m",
        "background": "\033[106m"
    },
}
LOG_RESET = "\033[0m"

class LoggingFormatter(logging.Formatter):


    def getStrFormat(colors):

        return colors["background"] + " {levelname} " + LOG_RESET + ":" + colors["foreground"] + "{name} - {message} ({filename}:{lineno})" + LOG_RESET

    FORMATS = {
        logging.DEBUG: getStrFormat(LOGGING_COLORS["cyan"]),
        logging.INFO: getStrFormat(LOGGING_COLORS["dark_yellow"]),
        logging.WARNING: getStrFormat(LOGGING_COLORS["orange"]),
        logging.ERROR: getStrFormat(LOGGING_COLORS["dark_red"]),
        logging.CRITICAL: getStrFormat(LOGGING_COLORS["red"]),
    }

    def format(self, record):
        LOG_FORMAT = self.FORMATS.get(record.levelno)
        FORMATTER = logging.Formatter(fmt=LOG_FORMAT, style="{")
        return FORMATTER.format(record=record)

CUSTOM_LOGGER = logging.StreamHandler()
CUSTOM_LOGGER.setLevel(logging.DEBUG)
CUSTOM_LOGGER.setFormatter(LoggingFormatter())

def getLogger(name):

    logger = logging.getLogger(name)

    logger.setLevel(logging.DEBUG)
    logger.addHandler(CUSTOM_LOGGER)

    return logger

PP = lambda msg : f"\n{(pprint.PrettyPrinter()).pformat(msg)}\n"

#_ API CLIENTS
SO_API = StackAPI("stackoverflow", version="2.3")
SO_API.page_size = 10
SO_API.max_pages = 1

# github.enable_console_debug_logging()
GH_API = lambda username : github.Github().get_user(username)
GH_API_URL = "https://api.github.com/"
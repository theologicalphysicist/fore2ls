import logging, pprint, json
from datetime import datetime, date

#_ CUSTOM LOGGER
LOGGING_COLORS: dict = {
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
LOGGING_EDITORS: dict = {
    "reset": "\033[0m",
    "bold": "\033[1m",
    "faint": "\033[2m",
    "italic": "\033[3m",
    "underline": "\033[4m",
}

def getStrFormat(colors: dict):

    return (
        colors["background"] + " {levelname} " + LOGGING_EDITORS["reset"] + 
        ":" + 
        colors["foreground"] + 
        LOGGING_EDITORS["bold"] + "{name}" + LOGGING_EDITORS["reset"] + 
        colors["foreground"] + 
        " - {message} " + 
        LOGGING_EDITORS["reset"] + "({filename}:{lineno})" +
        LOGGING_EDITORS["reset"]
    )

class LoggingFormatter(logging.Formatter):

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

#* initialise a new logger with this function
def getLogger(name: str):

    logger = logging.getLogger(name)

    logger.setLevel(logging.DEBUG)
    logger.addHandler(CUSTOM_LOGGER)

    return logger

def DefaultJSONSeralizer(obj): 
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError(f"type {type(obj)} is not (yet) serializable. report to file owner.")

#* import this for pretty printing JSON
printJSON = lambda msg : f"\n{json.dumps(msg, indent=4, default=DefaultJSONSeralizer)}\n"
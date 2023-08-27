import json
from yachalk import chalk

#_ LOCAL
from classes.models import RequestTokens, ResponseTokens


class Verbal:
    def __init__(self, framework: str = None, name: str = "verbal") -> None:
        self.framework: str = framework
        self.name : str = name
        self.colors: dict = {
            "red": "#E88388",
            "orange": "#EB8B59",
            "yellow": "#DBCB79",
            "cyan": "#66C2CD",
            "blue": "#71BEF2",
            "purple": "#D290E3",
            "white": "#e7e7e7"
        }
        self.levels: dict = {
            "INFO": 4,
            "DEBUG": 3,
            "WARNING": 2,
            "ERROR": 1,
            "CRITICAL": 0
        }
        self.serverColors: dict = {
            "request": "#EF596F",
            "response": "#61AFEF"
        }
    
    def __str__(self) -> str:
        return f"Verbal Logger called: {self.name}"
    

    def info(self, data) -> None:
        OUT = data if type(data) == str else json.dumps(data, indent=2)

        return print(
            "\n" + f"{chalk.bg_hex(self.colors['blue']).hex('#000').bold(' INFO ')}" +
            " - " +
            f"{chalk.hex(self.colors['blue']).underline(self.name)}" + ": " +
            f"{OUT}" + "\n"
        )
    
    def debug(self, data) -> None:
        OUT = data if type(data) == str else json.dumps(data, indent=2)

        return print(
            "\n" + f"{chalk.bg_hex(self.colors['yellow']).hex('#000').bold(' WARNING ')}" +
            " - " +
            f"{chalk.hex(self.colors['yellow']).underline(self.name)}" + ": " +
            f"{OUT}" + "\n"
        )
    
    def warning(self, data) -> None:
        OUT = data if type(data) == str else json.dumps(data, indent=2)

        return print(
            "\n" + f"{chalk.bg_hex(self.colors['orange']).hex('#000').bold(' ORANGE ')}" +
            " - " +
            f"{chalk.hex(self.colors['orange']).underline(self.name)}" + ": " +
            f"{OUT}" + "\n"
        )
    
    def error(self, data) -> None:

        OUT = data if type(data) == str else json.dumps(data, indent=2)

        return print(
            "\n" + f"{chalk.bg_hex(self.colors['red']).hex('#000').bold(' ERROR ')}" +
            " - " +
            f"{chalk.hex(self.colors['red']).underline(self.name)}" + ": " +
            f"{OUT}" + "\n"
        )
    

    def request(self, tokens: RequestTokens) -> None:
        QUERY = json.dumps(tokens.query, indent=2)
        BODY = json.dumps(tokens.body, indent=2)
        PARAMS = json.dumps(tokens.params, indent=2)

        if (self.framework == "fastapi"):
            return print(
                "\n" + f"{chalk.bg_hex(self.serverColors['request']).hex('#000').bold(' REQUEST ')}" + "\n" +
                f"{chalk.bold(tokens.method)} {chalk.underline(tokens.path)}, date:{chalk.italic(tokens.date)}" + "\n" +
                f"query: {chalk.hex(self.serverColors['request'])(QUERY)}" + "\n" +
                f"body: {chalk.hex(self.serverColors['request'])(BODY)}" + "\n" +
                f"params: {chalk.hex(self.serverColors['request'])(PARAMS)}" + "\n"
            )
    
    def response(self, tokens: ResponseTokens) -> None:

        if (self.framework == "fastapi"):
            return print(
                "\n" + f"{chalk.bg_hex(self.serverColors['response']).hex('#000').bold(' RESPONSE ')}" + "\n" +
                f"status:{chalk.hex(self.serverColors['response']).bold(tokens.status)}, content length:{chalk.underline(tokens.length)}, response time:{chalk.bold(str(tokens.responseTime) + 'ms')}" + "\n"
            )


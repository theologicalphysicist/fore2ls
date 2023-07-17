package main

import (
	"fmt"
	"os"
	"time"

	"github.com/muesli/termenv"
)

var OUTPUT = termenv.NewOutput(os.Stdout, termenv.WithProfile(termenv.TrueColor))
var LOGGING_COLORS = map[string]string{
	"red":    "#E88388",
	"orange": "#EB8B59",
	"yellow": "#DBCB79",
	"cyan":   "#66C2CD",
	"blue":   "#71bef2",
	"purple": "#D290E3",
}
var LOGGING_LEVELS = map[string]int8{
	"INFO":     4,
	"DEBUG":    3,
	"WARNING":  2,
	"ERROR":    1,
	"CRITICAL": 0,
}

func main() {
	DebugLog("Main", "Hello World")
}

func DebugLog(caller string, data string) {
	level_string := OUTPUT.String(" DEBUG ")
	caller_string := OUTPUT.String(caller)
	data_string := OUTPUT.String(data)
	date_string := OUTPUT.String(fmt.Sprintf("(%s)", time.Now().Format("15:04:05")))

	fmt.Println(
		level_string.Bold().Background(OUTPUT.Color(LOGGING_COLORS["blue"])).String()+" -",
		caller_string.Underline().Foreground(OUTPUT.Color(LOGGING_COLORS["blue"])).String()+":",
		data_string.Foreground(OUTPUT.Color(LOGGING_COLORS["blue"])),
		date_string.Foreground(OUTPUT.Color(LOGGING_COLORS["blue"])),
	)
}

type Logger struct {
	debug func(string, string)
	info  func(string, string)
}

//_ CHANGE CODE FORMATTER, I DONT LIKE THIS ONE

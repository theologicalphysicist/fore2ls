#!/bin/bash
g++ -g "$1".cpp -o "$1".exe
gdb --quiet "$1".exe

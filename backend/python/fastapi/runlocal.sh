#!/bin/bash
uvicorn main:APP --port 3000 --reload --log-level debug --no-access-log --env-file ./.env.local
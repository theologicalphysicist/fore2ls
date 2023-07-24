#!/bin/bash
uvicorn main:APP --port 3000 --reload --log-level warning --env-file ./.env.development
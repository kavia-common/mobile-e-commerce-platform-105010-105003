#!/bin/bash
cd /home/kavia/workspace/code-generation/mobile-e-commerce-platform-105010-105003/frontend_mobile
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


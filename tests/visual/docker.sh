#!/bin/sh
# Запуск визуальных тестов в том же образе, что и в CI.
# Версия образа должна совпадать с @playwright/test в package.json.
set -e
IMAGE=mcr.microsoft.com/playwright:v1.63.0-noble
docker run --rm --ipc=host \
  -e PLAYWRIGHT_DOCKER=1 \
  -v "$PWD":/work -v /work/node_modules -w /work \
  "$IMAGE" sh -c "npm ci --no-audit --no-fund && npm run build-storybook && npx playwright test $*"

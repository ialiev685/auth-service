#!/bin/sh
set -e

NODE_ENV=${NODE_ENV:-development}

echo "🚀 Starting in $NODE_ENV mode"

echo "🔄 Running migrations..."
yarn migrate

echo "🚀 Starting server..."
if [ "$NODE_ENV" = "production" ]; then
  exec yarn start
else
  exec yarn dev:docker
fi
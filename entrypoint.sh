#!/bin/sh
# set -e  

echo "🔄 Running migrations..."
yarn migrate

echo "🚀 Starting server..."
exec yarn dev:docker
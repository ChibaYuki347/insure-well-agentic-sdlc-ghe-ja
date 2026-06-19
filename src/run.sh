#!/bin/bash

# InsureWell Fullstack Startup Script
# Starts both Spring Boot backend and React frontend

set -e

SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

echo "🚀 Starting InsureWell Fullstack..."

# Prefer the Maven Wrapper (./mvnw) so a system Maven install is not required
# (e.g. in GitHub Codespaces). Fall back to a system `mvn` if the wrapper is absent.
if [ -x "$BACKEND_DIR/mvnw" ]; then
	MVN="$BACKEND_DIR/mvnw"
else
	MVN="mvn"
fi

# Start backend in background
echo "📦 Starting Spring Boot backend (using: $MVN)..."
cd "$BACKEND_DIR"
"$MVN" spring-boot:run &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Wait a moment for backend to be ready
sleep 3

# Start frontend
echo "⚛️  Starting React frontend..."
cd "$FRONTEND_DIR"
if [ ! -d node_modules ]; then
	npm install
fi
npm start &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "═══════════════════════════════════════════════"
echo "🎉 InsureWell is running!"
echo "───────────────────────────────────────────────"
echo "Backend:  http://localhost:8080/api"
echo "Frontend: http://localhost:3000"
echo "═══════════════════════════════════════════════"
echo ""
echo "Press Ctrl+C to stop both services."

# Wait for both processes
wait

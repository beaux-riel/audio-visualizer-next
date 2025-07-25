#!/bin/bash

# CI Test Script for Audio Visualizer
# This script runs all tests in the correct order for CI environments

set -e

echo "🔧 Installing dependencies..."
npm ci

echo "🏗️  Building the application..."
npm run build

echo "🧪 Running unit and integration tests with coverage..."
npm run test:coverage

echo "🎭 Installing Playwright browsers..."
npx playwright install --with-deps

echo "🌐 Running E2E tests..."
npm run test:e2e

echo "📊 Generating test reports..."
echo "✅ All tests completed successfully!"

# Check coverage thresholds
echo "📈 Checking coverage thresholds..."
npx vitest --coverage --reporter=text-summary --run

echo "🎉 CI tests completed successfully!"

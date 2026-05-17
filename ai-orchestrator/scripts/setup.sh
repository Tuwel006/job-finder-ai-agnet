#!/bin/bash
set -e

echo "Setting up JobFind AI Orchestrator..."

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Poetry..."
pip install poetry

echo "Installing dependencies..."
poetry install

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env and add your API keys"
fi

echo ""
echo "Setup complete!"
echo ""
echo "To activate the environment: source venv/bin/activate"
echo "To configure API keys: nano .env"
echo ""
echo "Next steps:"
echo "  1. Edit .env and add your API keys"
echo "  2. Run: source venv/bin/activate"
echo "  3. Test: python -c 'from src.services import LLMService; print(\"OK\")'
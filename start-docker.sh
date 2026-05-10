#!/bin/bash
echo "Starting JobFind Docker containers..."
docker compose up -d
echo "Waiting for services to be healthy..."
sleep 5
docker compose ps
echo "Services started!"
echo ""
echo "PostgreSQL: localhost:5433"
echo "Redis: localhost:6379"
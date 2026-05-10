#!/bin/bash
echo "JobFind Docker Status:"
echo ""
docker compose ps
echo ""
echo "PostgreSQL:"
docker exec jobfind-postgres psql -U jobfind -c "SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';" 2>/dev/null || echo "  Not running"
echo ""
echo "Redis:"
docker exec jobfind-redis redis-cli ping 2>/dev/null || echo "  Not running"
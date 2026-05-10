.PHONY: help install dev dev_backend dev_frontend db_start db_stop db_status docker_start docker_stop docker_status build clean test lint

help:
	@echo "JobFind Development Commands"
	@echo "============================"
	@echo "make install         - Install all dependencies"
	@echo "make dev             - Run both backend and frontend"
	@echo "make dev_backend     - Run backend only"
	@echo "make dev_frontend    - Run frontend only"
	@echo "make db_start        - Start database containers"
	@echo "make db_stop         - Stop database containers"
	@echo "make db_status       - Show database status"
	@echo "make docker_start    - Start all containers"
	@echo "make docker_stop     - Stop all containers"
	@echo "make build           - Build all projects"
	@echo "make clean           - Clean build outputs"
	@echo "make test            - Run tests"

install:
	npm install

dev:
	npm run dev

dev_backend:
	cd backend && npm run dev

dev_frontend:
	cd frontend && npm run dev

db_start:
	./start-docker.sh

db_stop:
	./stop-docker.sh

db_status:
	./docker-status.sh

docker_start:
	docker compose up -d

docker_stop:
	docker compose down

docker_status:
	docker compose ps

build:
	npm run build

clean:
	rm -rf backend/dist
	rm -rf frontend/.next
	rm -rf node_modules/.cache

test:
	npm run test

lint:
	cd backend && npm run lint || true
	cd frontend && npm run lint || true
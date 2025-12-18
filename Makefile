.PHONY: help build up down restart logs clean dev-db

help: ## Hiển thị trợ giúp
	@echo "Bình Minh FC - Docker Commands"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Docker Production

build: ## Build Docker images
	docker-compose build

up: ## Start tất cả services
	docker-compose up -d

down: ## Stop tất cả services
	docker-compose down

restart: ## Restart tất cả services
	docker-compose restart

logs: ## Xem logs
	docker-compose logs -f

clean: ## Stop và xóa volumes (reset database)
	docker-compose down -v

##@ Docker Development

dev-db: ## Chỉ start MySQL cho development
	docker-compose -f docker-compose.dev.yml up -d

dev-db-down: ## Stop MySQL development
	docker-compose -f docker-compose.dev.yml down

##@ Database

migrate: ## Run migrations
	docker-compose exec app npx prisma migrate deploy

seed: ## Seed database
	docker-compose exec app npx prisma db seed

db-reset: ## Reset database (⚠️ Xóa tất cả data)
	docker-compose exec app npx prisma migrate reset --force

##@ Utilities

shell: ## Vào shell của app container
	docker-compose exec app sh

mysql-cli: ## Vào MySQL CLI
	docker-compose exec mysql mysql -u bmfc_user -pbmfc_password binh_minh_fc

ps: ## Xem status containers
	docker-compose ps

rebuild: ## Rebuild và restart
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

##@ Development

install: ## Install dependencies local
	npm install

dev: ## Run development server local
	npm run dev

prisma-studio: ## Open Prisma Studio local
	npx prisma studio

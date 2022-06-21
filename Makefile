#!make

.DEFAULT_GOAL := help
.PHONY: help

# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)

TARGET_MAX_CHAR_NUM=35

## Shows help
help:
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  ${YELLOW}%-$(TARGET_MAX_CHAR_NUM)s${RESET} ${GREEN}%s${RESET}\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

## Installs everything needed to run the application
setup: _check_docker build

## Run all the app
run:
	@docker-compose up -d 2>&1 && npm start
 
## Halts the application by stoping all services
stop:
	@docker-compose down --remove-orphans

## Shows services logs
logs:
	@docker-compose logs -f

## Build and install  dependencies
build:
	@docker-compose build && yarn install

## Alerts if docker-compose is not installed
_check_docker:
	@docker-compose -v >/dev/null 2>&1 || echo "${YELLOW}install docker and docker-compose manually${RESET}"





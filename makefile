db-dev:
	sudo docker compose --env-file .env.dev -f docker-compose-dev.yml up --build -d db

build-dev:
	sudo docker compose --env-file .env.dev -f docker-compose-dev.yml up --build -d

stop-dev:
	sudo docker compose --env-file .env.dev -f docker-compose-dev.yml down

build:
	sudo docker compose --env-file .env.prod -f docker-compose-prod.yml up --build -d

stop:
	sudo docker compose --env-file .env.prod -f docker-compose-prod.yml down
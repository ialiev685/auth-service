build-dev:
	sudo docker compose --env-file .env.dev -f docker-compose-dev.yml up --build -d

stop-dev:
	sudo docker compose -f docker-compose-dev.yml down
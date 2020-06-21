run:
	deno run --allow-env --allow-read="." --allow-write="." --allow-net --allow-plugin --unstable init.ts

debug:
	DEBUG=* deno run --allow-env --allow-read="." --allow-write="." --allow-net --allow-plugin --unstable init.ts

setup:
	deno run --allow-read="." --allow-write="." --unstable setup.ts

install:
	deno cache --reload --lock=lock.json deps.ts

lock:
	deno cache deps.ts --lock lock.json --lock-write

docker-up: docker-down
	docker-compose up -d

docker-down:
	docker-compose down --remove-orphans

mongo-shell:
	docker-compose exec mongodb bash -c 'mongo'

.PHONY: run setup install lock docker-up docker-down
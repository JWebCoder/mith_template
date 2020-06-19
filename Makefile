run:
	deno run --allow-env --allow-read="." --allow-net="0.0.0.0" init.ts

setup:
	deno run --allow-read="." --allow-write="." --unstable setup.ts

install:
	deno cache --reload --lock=lock.json deps.ts

lock:
	deno cache deps.ts --lock lock.json --lock-write

.PHONY: run setup install lock
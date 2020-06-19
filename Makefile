run:
	deno run --allow-env --allow-read="." --allow-net="0.0.0.0" init.ts

setup:
	deno run --allow-read="." --allow-write="." --unstable setup.ts

.PHONY: run test setup
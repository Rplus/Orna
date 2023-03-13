deploy: build-map
	npm run deploy;

build-map:
	cd ./map; \
	npm run build;


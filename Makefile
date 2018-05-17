install:
	cd src/python; make install

install-compile:
	npm install

js:
	npm run watch

run:
	cd src/python; make run

serve:
	node src/ts/server/server.js
setup:
	python setup.py

install:
	# for apsw Cython
	apt-get install python-dev
	# for peewee Cython
	apt-get install libsqlite3-dev

	cd TexDBook; make install
	make setup
	cd TexDBook/src/data; make all

install-compile:
	cd TexDBook; make install-compile

js:
	cd TexDBook; make js

run:
	python TexDBook.py
setup:
	python setup.py

favicon:
	cd TexDBook/src/data; cp CLRS.jpg favicon.ico

install:
	# for apsw Cython
	apt-get install python-dev
	# for peewee Cython
	apt-get install libsqlite3-dev

	cd TexDBook; make install
	make setup
	make favicon


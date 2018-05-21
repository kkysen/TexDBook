setup:
	python setup.py

favicon:
	cd TexDBook/src/data; ln -s CLRS.jpg favicon.ico

install:
	cd TexDBook; make install
	make setup
	make favicon


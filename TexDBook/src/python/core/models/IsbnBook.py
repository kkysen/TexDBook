from peewee import FixedCharField, Tuple

from TexDBook.src.python.core.models.db import flask_db


class IsbnBook(flask_db.Model):
    isbn = FixedCharField(13, primary_key=True)
    
    @staticmethod
    def isbn10_to_isbn13(isbn10):
        # type: (str) -> str
        # convert from ISBN 10 to ISBN 13
        # add 978 to front, replace ISBN 10 check digit w/ ISBN 13 check digit
        isbn = "978" + isbn10[:-1]
        digits = map(int, isbn)
        check = sum((3 if i & 1 else 1) * int(isbn[i]) for i in xrange(len(isbn)))
        check = (10 - (check % 10)) % 10
        isbn += str(check)
        return isbn
    
    @staticmethod
    def clean_isbn(isbn):
        # type: (str) -> str
        """Convert any ISBN configuration into an ISBN 13 with no delimiters."""
        isbn = isbn.replace("-", "")
        if not isbn.isdigit():
            raise ValueError("Incorrectly formatted ISBN: " + isbn)
        
        if len(isbn) == 10:
            isbn = IsbnBook.isbn10_to_isbn13(isbn)
        return isbn
    
    @classmethod
    def get_or_create(cls, isbn):
        # type: (str) -> Tuple[IsbnBook, bool]
        isbn13 = cls.clean_isbn(isbn)  # type: str
        # TODO fetch isbn book data from Google Books API
        # TODO async or sync
        return super(IsbnBook, cls).get_or_create(isbn=isbn13)

from peewee import FixedCharField, Tuple

from TexDBook.src.python.core.models.db import flask_db


class IsbnBook(flask_db.Model):
    isbn = FixedCharField(13, primary_key=True)
    
    @staticmethod
    def clean(isbn):
        # type: (str) -> str
        """Convert any ISBN configuration into an ISBN 13 with no delimiters."""
        pass
    
    @classmethod
    def get_or_create_cleaned(cls, isbn):
        # type: (str) -> Tuple[IsbnBook, bool]
        isbn13 = cls.clean(isbn)  # type: str
        # TODO fetch isbn book data from Google Books API
        # TODO async or sync
        return cls.get_or_create(isbn=isbn13)

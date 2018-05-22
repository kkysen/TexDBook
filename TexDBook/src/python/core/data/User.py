from peewee import CharField, IntegerField

from TexDBook.src.python.core.app import flask_db
from TexDBook.src.python.core.data.Book import Book


class User(flask_db.Model):
    username = CharField(primary_key=True)
    password = CharField()
    balance = IntegerField()
    
    def add_book(self, barcode, isbn):
        # type: (str, str) -> Book
        """Create a new Book owned by this User."""
        return Book.create_new(barcode, isbn, self)

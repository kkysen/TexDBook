from peewee import CharField, ForeignKeyField

from TexDBook.src.python.core.models import User
from TexDBook.src.python.core.models.IsbnBook import IsbnBook
from TexDBook.src.python.core.models.db import flask_db


class Book(flask_db.Model):
    barcode = CharField(primary_key=True)
    isbn_book = ForeignKeyField(IsbnBook, backref="books")
    owner = ForeignKeyField(User, backref="ownedBooks")
    lender = ForeignKeyField(User, backref="lentBooks")
    borrower = ForeignKeyField(User, backref="borrowedBooks")
    
    @staticmethod
    def clean_barcode(barcode):
        # type: (str) -> str
        return barcode  # TODO
    
    @classmethod
    def create(cls, barcode, isbn, owner):
        # type: (str, str, User) -> Book
        """Create a new Book owned by `owner`."""
        # TODO make transaction from initial, universal lender?
        return super(Book, cls).create(
            barcode=cls.clean_barcode(barcode),
            isbn_book=IsbnBook.get_or_create(isbn),
            owner=owner,
            lender=owner,
            borrower=owner,
        )


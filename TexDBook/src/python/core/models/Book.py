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
    def clean(barcode):
        # type: (str) -> str
        barcode.replace("-", "");
        if not barcode.isdigit():
            raise ValueError("Incorrectly formatted ISBN")
        if barcode.length == 10:
            #convert from ISBN 10 to ISBN 13
            #add 978 to front and strip ISBN10 check digit
            #for check,
            #if even index, mult by 3, then sum digits, mod 10, then subtract value from 10
            barcode = "978" + barcode[:-1]
            bar = [int(i) for i in barcode]
            for i in range(bar.length):
                if i % 2 == 0:
                    bar[i] *= 3
            check = 10 - (sum(bar) % 10)
            barcode += str(check)
        return barcode
    
    @classmethod
    def create(cls, barcode, isbn, owner):
        # type: (str, str, User) -> Book
        """Create a new Book owned by `owner`."""
        # TODO make transaction from initial, universal lender?
        return super(Book, cls).create(
            barcode=cls.clean(barcode),
            isbn_book=IsbnBook.get_or_create_cleaned(isbn),
            owner=owner,
            lender=owner,
            borrower=owner,
        )

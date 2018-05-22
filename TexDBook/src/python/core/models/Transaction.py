from datetime import datetime

from peewee import DateTimeField, ForeignKeyField, IntegerField

from TexDBook.src.python.core.models.Book import Book
from TexDBook.src.python.core.models.User import User
from TexDBook.src.python.core.models.db import flask_db, db


class Transaction(flask_db.Model):
    time = DateTimeField(default=datetime.now)
    book = ForeignKeyField(Book, backref="transactions")
    lender = ForeignKeyField(User, backref="lendings")
    borrower = ForeignKeyField(User, backref="borrowings")
    payment = IntegerField()
    
    @classmethod
    def create(cls, book, borrower, payment):
        # type: (Book, User, int) -> Transaction
        """Make a transaction."""
        with db.atomic():
            lender = book.borrower  # type: User
            
            transaction = super(Transaction, cls).create(
                book=book,
                lender=lender,
                borrower=borrower,
                payment=payment,
            )  # type: Transaction
            
            borrower.balance -= payment
            lender.balance += payment
            
            book.borrower = borrower
            book.lender = lender
            
            lender.save()
            borrower.save()
            book.save()
            
            return transaction

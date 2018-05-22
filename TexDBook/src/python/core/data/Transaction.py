from datetime import datetime

from peewee import DateTimeField, ForeignKeyField, IntegerField

from TexDBook.src.python.core.app import db, flask_db
from TexDBook.src.python.core.data.Book import Book
from TexDBook.src.python.core.data.User import User


class Transaction(flask_db.Model):
    time = DateTimeField(default=datetime.now)
    book = ForeignKeyField(Book, backref="transactions")
    lender = ForeignKeyField(User, backref="lendings")
    borrower = ForeignKeyField(User, backref="borrowings")
    payment = IntegerField()
    
    @classmethod
    def make(cls, book, borrower, payment):
        # type: (Book, User, int) -> Transaction
        """Make a transaction."""
        with db.atomic():
            lender = book.borrower  # type: User
            
            transaction = Transaction.create(
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

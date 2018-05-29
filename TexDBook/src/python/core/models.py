import json
from datetime import datetime

from peewee import Database, DateTimeField, FixedCharField, ForeignKeyField, IntegerField, TextField
from playhouse.flask_utils import FlaskDB
from playhouse.shortcuts import model_to_dict
from typing import Any, Dict, List, Optional, Tuple, Callable

from TexDBook.src.python.core.db_loader import TexDBookDatabase
from TexDBook.src.python.core.init_app import NAME, app, default_init_app, resolve_path
from TexDBook.src.python.core.login_manager import login_manager
from TexDBook.src.python.util.oop import extend, override
from TexDBook.src.python.util.password import hash_password, verify_password

app.config.from_object(__name__)  # TODO FIXME check cookie security

db = TexDBookDatabase(resolve_path("data", NAME + ".db"))  # type: Database


@override(TexDBookDatabase)
def connect(_super, self, reuse_if_open=True):
    # type: (Callable[[TexDBookDatabase, bool], bool], TexDBookDatabase, bool) -> bool
    return _super(self, reuse_if_open)


flask_db = FlaskDB(app, db)  # type: FlaskDB

init_app = default_init_app


@extend(flask_db.Model)
def to_dict(self):
    # type: (flask_db.Model) -> Dict[str, Any]
    return model_to_dict(self)


@extend(flask_db.Model)
def to_json(self):
    # type: (flask_db.Model) -> Dict[str, Any]
    return json.dumps(self.to_dict())


@extend(flask_db.Model)
def __str__(self):
    # type: (flask_db.Model) -> str
    return str(self.to_json())


class User(flask_db.Model):
    id = IntegerField(primary_key=True, default=None)
    username = TextField()
    hashed_password = TextField()
    balance = IntegerField(default=0)
    
    @classmethod
    def create(cls, username, password):
        # type: (str, str) -> User
        return super(User, cls).create(username=username, hashed_password=hash_password(password))
    
    def __init__(self, **kwargs):
        # type: (Dict[str, Any]) -> None
        super(User, self).__init__(**kwargs)
        self.is_authenticated = False
        self.is_active = True
        self.is_anonymous = False
    
    def get_id(self):
        # type: () -> unicode
        return unicode(self.id)
    
    @classmethod
    def load(cls, user_id):
        # type: (unicode) -> User
        user = cls.get_or_none(id=int(user_id))
        user.is_authenticated = True
        user.hashed_password = None  # make sure to not leak this
        return user
    
    @classmethod
    def login(cls, username, password):
        # type: (unicode, unicode) -> Optional[User]
        user = User.get_or_none(username=username)
        if user and verify_password(password, user.hashed_password):
            return user
        return None
    
    def add_book(self, barcode, isbn):
        # type: (unicode, unicode) -> Tuple[Book, bool]
        """Create a new Book owned by this User."""
        book = Book.get_or_none(barcode=barcode, isbn=isbn)
        if book:
            return book, False
        return Book.create(barcode, isbn, self), True


login_manager.user_callback = User.load


class IsbnBook(flask_db.Model):
    isbn = FixedCharField(13, primary_key=True)
    
    @staticmethod
    def isbn10_to_isbn13(isbn10):
        # type: (unicode) -> unicode
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
        # type: (unicode) -> unicode
        """Convert any ISBN configuration into an ISBN 13 with no delimiters."""
        isbn = isbn.replace("-", "")
        if not isbn.isdigit():
            raise ValueError("Incorrectly formatted ISBN: " + isbn)
        
        if len(isbn) == 10:
            isbn = IsbnBook.isbn10_to_isbn13(isbn)
        return isbn
    
    @classmethod
    def get_or_create(cls, isbn):
        # type: (unicode) -> Tuple[IsbnBook, bool]
        isbn13 = cls.clean_isbn(isbn)  # type: str
        # TODO fetch isbn book data from Google Books API
        # TODO async or sync
        return super(IsbnBook, cls).get_or_create(isbn=isbn13)
    
    @classmethod
    def all_isbns(cls):
        # type: () -> List[unicode]
        return cls.select(cls.isbn)


class Book(flask_db.Model):
    barcode = TextField(primary_key=True)
    isbn_book = ForeignKeyField(IsbnBook, backref="books")
    owner = ForeignKeyField(User, backref="ownedBooks")
    lender = ForeignKeyField(User, backref="lentBooks")
    borrower = ForeignKeyField(User, backref="borrowedBooks")
    
    @staticmethod
    def clean_barcode(barcode):
        # type: (unicode) -> unicode
        return barcode  # TODO
    
    @classmethod
    def create(cls, barcode, isbn, owner):
        # type: (unicode, unicode, User) -> Book
        """Create a new Book owned by `owner`."""
        # TODO make transaction from initial, universal lender?
        return super(Book, cls).create(
            barcode=cls.clean_barcode(barcode),
            isbn_book=IsbnBook.get_or_create(isbn),
            owner=owner,
            lender=owner,
            borrower=owner,
        )


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


def setup_db():
    # type: () -> None
    db.connect()
    db.create_tables([User, IsbnBook, Book, Transaction])
    print(db)
    
    username = "Khyber"
    password = "5e9708d50aa3cef560fa6a6d47787e44aae25d19de9bb06a9f653939df82881b"  # SHA256 of "Sen"
    # User.create(username, password)
    user = User.login(username, password)
    print(user)
    print("Done")


setup_db()

from datetime import datetime

from peewee import CharField, Database, DateTimeField, FixedCharField, ForeignKeyField, IntegerField, SqliteDatabase
from playhouse.flask_utils import FlaskDB
from typing import Tuple, Union

from TexDBook.src.python.core.init_app import NAME, app, default_init_app, resolve_path
from TexDBook.src.python.core.login_manager import login_manager
from TexDBook.src.python.util.password import hash_password, verify_password

app.config.from_object(__name__)

db = SqliteDatabase(resolve_path("data", NAME + ".db"))  # type: Database

flask_db = FlaskDB(app, db)  # type: FlaskDB

init_app = default_init_app


class User(flask_db.Model):
    id = IntegerField(primary_key=True, default=None)
    username = CharField()
    hashed_password = CharField()
    balance = IntegerField(default=0)
    
    @classmethod
    def create(cls, username, password):
        # type: (str, str) -> User
        return super(User, cls).create(username=username, hashed_password=hash_password(password))
    
    def __init__(self, username, hashed_password):
        # type: (str, str) -> None
        super(User, self).__init__(username=username, hashed_password=hashed_password)
        self.is_authenticated = False
        self.is_active = True
        self.is_anonymous = False
    
    def get_id(self):
        # type: () -> unicode
        return unicode(self.id)
    
    @classmethod
    @login_manager.user_loader  # TODO check decorator order
    def load(cls, user_id):
        # type: (unicode) -> User
        return cls.get_or_none(id=int(user_id))
    
    @classmethod
    def login(cls, username, password):
        # type: (str, str) -> Union[User, None]
        user = User.get_or_none(username=username)
        if user and verify_password(password, user.hashed_password):
            return user
        return None
    
    def add_book(self, barcode, isbn):
        # type: (str, str) -> Book
        """Create a new Book owned by this User."""
        return Book.create(barcode, isbn, self)


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

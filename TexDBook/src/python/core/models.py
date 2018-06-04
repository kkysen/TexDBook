import json
from datetime import datetime

from peewee import Database, DateTimeField, FixedCharField, FloatField, ForeignKeyField, IntegerField, ManyToManyField, \
    TextField
from playhouse.flask_utils import FlaskDB
from playhouse.hybrid import hybrid_property
from playhouse.shortcuts import model_to_dict
from typing import Any, Callable, Dict, List, Optional, Tuple

from TexDBook.src.python.core.db_loader import TexDBookDatabase
from TexDBook.src.python.core.init_app import NAME, app, default_init_app, resolve_path
from TexDBook.src.python.core.login_manager import login_manager
from TexDBook.src.python.util.flask.rest_api import unpack_json
from TexDBook.src.python.util.oop import extend, override
from TexDBook.src.python.util.password import hash_password, verify_password
from TexDBook.src.python.util.types import Json

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
        # type: (unicode, unicode) -> User
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
    
    @classmethod
    def login_or_create(cls, username, password):
        # type: (unicode, unicode) -> Tuple[User, bool]
        user = cls.login(username, password)
        if user is not None:
            return user, False
        return cls.create(username, password), True
    
    def add_book(self, barcode, isbn):
        # type: (unicode, unicode) -> Tuple[Book, bool]
        """Create a new Book owned by this User."""
        book = Book.get_or_none(barcode=barcode)
        if book or book.isbn != isbn:
            return book, False
        return Book.create(barcode, isbn, self), True


login_manager.user_callback = User.load


class Department(flask_db.Model):
    name = TextField(primary_key=True)


class Author(flask_db.Model):
    name = TextField()


class Publisher(flask_db.Model):
    name = TextField()


class Category(flask_db.Model):
    name = TextField()


class Language(flask_db.Model):
    name = TextField()


class IsbnBook(flask_db.Model):
    isbn = FixedCharField(13, primary_key=True)
    department = ForeignKeyField(Department, backref="isbns")
    
    # relevant fields returned by Google Books API
    title = TextField()
    authors = ManyToManyField(Author, backref="isbns")
    publisher = ForeignKeyField(Publisher, backref="isbns")
    published_date = TextField()
    description = TextField()
    page_count = IntegerField()
    categories = ManyToManyField(Category, backref="isbns")
    average_rating = FloatField()
    ratings_count = IntegerField()
    small_thumbnail = TextField()
    thumbnail = TextField()
    language = ForeignKeyField(Language, backref="isbns")
    preview_link = TextField()
    info_link = TextField()
    link = TextField()
    
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
    def get_or_create(cls, isbn_book_json):
        # type: (Json) -> Tuple[IsbnBook, bool]
        fields = unpack_json(
            isbn_book_json,
            "isbn",
            "department",
            "title",
            "authors",
            "publisher",
            "publishedDate",
            "description",
            "pageCount",
            "categories",
            "averageRating",
            "ratingsCount",
            "imageLinks",
            "language",
            "previewLink",
            "infoLink",
            "link",
        )  # type: Tuple[unicode, unicode, unicode, List[unicode], unicode, unicode, unicode, int, List[unicode], float, int, Json, unicode, unicode, unicode, unicode]
        isbn, \
        department, \
        title, \
        authors, \
        publisher, \
        published_date, \
        description, \
        page_count, \
        categories, \
        average_rating, \
        ratings_count, \
        image_links, \
        language, \
        preview_link, \
        info_link, \
        link, \
            = fields
        
        department = Department.get_or_create(name=department)[0]  # type: Department
        authors = [Author.get_or_create(name=author)[0] for author in authors]  # type: List[Author]
        publisher = Publisher.get_or_create(name=publisher)[0]  # type: Publisher
        categories = [Category.get_or_create(name=category)[0] for category in categories]  # type: List[Category]
        language = Language.get_or_create(name=language)[0]  # type: Language
        
        small_thumbnail, thumbnail = \
            unpack_json(image_links, "smallThumbnail", "thumbnail")  # type: Tuple[unicode, unicode]
        
        isbn_book, created = super(IsbnBook, cls).get_or_create(
            isbn=isbn,
            department=department,
            title=title,
            publisher=publisher,
            published_date=published_date,
            description=description,
            page_count=page_count,
            average_rating=average_rating,
            ratings_count=ratings_count,
            small_thumbnail=small_thumbnail,
            thumbnail=thumbnail,
            language=language,
            preview_link=preview_link,
            info_link=info_link,
            link=link,
        )
        if created:
            isbn_book.authors.add(authors)
            isbn_book.categories.add(categories)
            isbn_book.save()
        return isbn_book, created
    
    @classmethod
    def all_isbns(cls):
        # type: () -> List[unicode]
        return [isbn_book.isbn for isbn_book in cls.select(cls.isbn)]


IsbnBookAuthor = IsbnBook.authors.get_through_model()
IsbnBookCategory = IsbnBook.categories.get_through_model()


class Book(flask_db.Model):
    barcode = TextField(primary_key=True)
    isbn_book = ForeignKeyField(IsbnBook, backref="books")
    owner = ForeignKeyField(User, backref="owned_books")
    lender = ForeignKeyField(User, backref="lent_books")
    borrower = ForeignKeyField(User, backref="borrowed_books")
    
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
            isbn_book=IsbnBook.get(isbn=isbn),
            owner=owner,
            lender=owner,
            borrower=owner,
        )
    
    @hybrid_property
    def isbn(self):
        # type: () -> unicode
        return self.isbn_book.isbn


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
    db.create_tables([
        User,
        Department,
        Author,
        IsbnBookAuthor,
        Publisher,
        Category,
        IsbnBookCategory,
        Language,
        IsbnBook,
        Book,
        Transaction,
    ])
    print(db)
    
    username = "Khyber"
    password = "Sen"  # "5e9708d50aa3cef560fa6a6d47787e44aae25d19de9bb06a9f653939df82881b"  # SHA256 of "Sen"
    user, created = User.login_or_create(username, password)
    IsbnBook.get_or_create(
        {
            "isbn": "9780262033848",
            "department": "Computer Science",
            "title": "Introduction to Algorithms",
            "authors": ["Thomas H. Cormen"],
            "publisher": "MIT Press",
            "publishedDate": "2009-07-31",
            "description": "A new edition of the essential text and professional reference, with substantial new material on such topics as vEB trees, multithreaded algorithms, dynamic programming, and edge-based flow.",
            "pageCount": 1292,
            "categories": ["Computers"],
            "averageRating": 4.5,
            "ratingsCount": 3,
            "imageLinks": {
                "smallThumbnail": "http://books.google.com/books/content?id=i-bUBQAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
                "thumbnail": "http://books.google.com/books/content?id=i-bUBQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            "language": "en",
            "previewLink": "http://books.google.com/books?id=i-bUBQAAQBAJ&pg=PP1&dq=isbn:9780262033848&hl=&cd=1&source=gbs_api",
            "infoLink": "http://books.google.com/books?id=i-bUBQAAQBAJ&dq=isbn:9780262033848&hl=&source=gbs_api",
            "link": "https://books.google.com/books/about/Introduction_to_Algorithms.html?hl=&id=i-bUBQAAQBAJ",
        })
    print(user.add_book("123", "9780262033848"))
    
    print(user)
    print("Done")


setup_db()

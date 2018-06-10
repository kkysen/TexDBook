import json
from datetime import datetime

# noinspection PyProtectedMember
from peewee import Alias, Database, DateTimeField, Field, FixedCharField, FloatField, ForeignKeyField, IntegerField, \
    ManyToManyField, TextField
from playhouse.flask_utils import FlaskDB
from playhouse.hybrid import hybrid_property
# noinspection PyProtectedMember
from playhouse.shortcuts import _clone_set
from typing import Any, Callable, Dict, List, Optional, Tuple

from TexDBook.src.python.core.db_loader import TexDBookDatabase
from TexDBook.src.python.core.init_app import NAME, app, default_init_app, resolve_path
from TexDBook.src.python.core.login_manager import login_manager
from TexDBook.src.python.util.annotations import override as mark_override
from TexDBook.src.python.util.flask.rest_api import unpack_json
from TexDBook.src.python.util.oop import override
from TexDBook.src.python.util.password import hash_password, verify_password
from TexDBook.src.python.util.types import Json

init_app = default_init_app

app.config.from_object(__name__)  # TODO FIXME check cookie security

db = TexDBookDatabase(resolve_path("data", NAME + ".db"))  # type: Database


@override(TexDBookDatabase)
def connect(_super, self, reuse_if_open=True):
    # type: (Callable[[TexDBookDatabase, bool], bool], TexDBookDatabase, bool) -> bool
    return _super(self, reuse_if_open)


flask_db = FlaskDB(app, db)  # type: FlaskDB


class Model(flask_db.Model):
    
    def to_dict(self,
                recurse=True, backrefs=False, only=None,
                exclude=None, seen=None, extra_attrs=None,
                fields_from_query=None, max_depth=None, manytomany=False):
        # type: () -> Json
        # Copied and modified from playhouse.shortcuts.model_to_dict
        """
        Convert a model instance (and any related objects) to a dictionary.
        
        :param bool recurse: Whether foreign-keys should be recursed.
        :param bool backrefs: Whether lists of related objects should be recursed.
        :param only: A list (or set) of field instances indicating which fields
            should be included.
        :param exclude: A list (or set) of field instances that should be
            excluded from the dictionary.
        :param list extra_attrs: Names of model instance attributes or methods
            that should be included.
        :param SelectQuery fields_from_query: Query that was source of model. Take
            fields explicitly selected by the query and serialize them.
        :param int max_depth: Maximum depth to recurse, value <= 0 means no max.
        :param bool manytomany: Process many-to-many fields.
        """
        
        model = self
        
        max_depth = -1 if max_depth is None else max_depth
        if max_depth == 0:
            recurse = False
        
        only = _clone_set(only)
        extra_attrs = _clone_set(extra_attrs)
        
        if fields_from_query is not None:
            # noinspection PyProtectedMember
            for item in fields_from_query._returning:
                if isinstance(item, Field):
                    only.add(item)
                elif isinstance(item, Alias):
                    # noinspection PyProtectedMember
                    extra_attrs.add(item._alias)
        
        data = {}
        exclude = _clone_set(exclude)
        seen = _clone_set(seen)
        exclude |= seen
        model_class = type(model)
        
        if manytomany:
            # noinspection PyProtectedMember
            for name, m2m in model._meta.manytomany.items():
                if (name in exclude) or (only and (name not in only)):
                    continue
                
                # noinspection PyProtectedMember
                exclude.update((m2m, m2m.rel_model._meta.manytomany[m2m.backref]))
                # noinspection PyProtectedMember
                for fkf in m2m.through_model._meta.refs:
                    exclude.add(fkf)
                
                accum = []
                for rel_obj in getattr(model, name):
                    accum.append(rel_obj.to_dict(
                        recurse=recurse,
                        backrefs=backrefs,
                        only=only,
                        exclude=exclude,
                        max_depth=max_depth - 1))
                data[name] = accum
        
        # noinspection PyProtectedMember
        for field in model._meta.sorted_fields:
            if field in exclude or (only and (field not in only)):
                continue
            
            field_data = model.__data__.get(field.name)
            if isinstance(field, ForeignKeyField) and recurse:
                if field_data:
                    seen.add(field)
                    rel_obj = getattr(model, field.name)
                    field_data = rel_obj.to_dict(
                        recurse=recurse,
                        backrefs=backrefs,
                        only=only,
                        exclude=exclude,
                        seen=seen,
                        max_depth=max_depth - 1)
                else:
                    field_data = None
            
            data[field.name] = field_data
        
        if extra_attrs:
            for attr_name in extra_attrs:
                attr = getattr(model, attr_name)
                if callable(attr):
                    data[attr_name] = attr()
                else:
                    data[attr_name] = attr
        
        if backrefs and recurse:
            # noinspection PyProtectedMember
            for foreign_key, rel_model in model._meta.backrefs.items():
                descriptor = getattr(model_class, foreign_key.backref)
                if descriptor in exclude or foreign_key in exclude:
                    continue
                if only and (descriptor not in only) and (foreign_key not in only):
                    continue
                
                accum = []
                exclude.add(foreign_key)
                related_query = getattr(model, foreign_key.backref)
                
                for rel_obj in related_query:
                    accum.append(rel_obj.to_dict(
                        recurse=recurse,
                        backrefs=backrefs,
                        only=only,
                        exclude=exclude,
                        max_depth=max_depth - 1))
                
                data[foreign_key.backref] = accum
        
        return data


def to_json(self):
    # type: () -> str
    return json.dumps(self.to_dict())


@mark_override
def __str__(self):
    # type: () -> str
    return self.to_json()


class User(Model):
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
        print("load user", user)
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
        if book:
            return book, False
        return Book.create(barcode, isbn, self), True
    
    @mark_override
    def to_dict(self, **kwargs):
        # type: () -> Json
        # keep other data safe, like the hashed password
        return super(User, self).to_dict(
            only={User.id, User.username} | kwargs.pop("only", set()), **kwargs)

    @classmethod
    def all_users(cls):
        # type: () -> List[User]
        return list(cls.select())


login_manager.user_callback = User.load


class Department(Model):
    name = TextField()


class Author(Model):
    name = TextField()


class Publisher(Model):
    name = TextField()


class Category(Model):
    name = TextField()


class Language(Model):
    name = TextField()


class IsbnBook(Model):
    isbn = FixedCharField(13, primary_key=True)
    department = ForeignKeyField(Department, backref="isbns")
    
    # relevant fields returned by Google Books API
    title = TextField()
    authors = ManyToManyField(Author, backref="isbns")
    publisher = ForeignKeyField(Publisher, backref="isbns")
    publishedDate = TextField()
    description = TextField()
    pageCount = IntegerField()
    categories = ManyToManyField(Category, backref="isbns")
    averageRating = FloatField()
    ratingsCount = IntegerField()
    image = TextField(null=True)
    language = ForeignKeyField(Language, backref="isbns")
    previewLink = TextField()
    infoLink = TextField()
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
            "image",
            "language",
            "previewLink",
            "infoLink",
            "link",
        )  # type: Tuple[unicode, unicode, unicode, List[unicode], unicode, unicode, unicode, int, List[unicode], float, int, unicode, unicode, unicode, unicode, unicode]
        isbn, \
        department, \
        title, \
        authors, \
        publisher, \
        publishedDate, \
        description, \
        pageCount, \
        categories, \
        averageRating, \
        ratingsCount, \
        image, \
        language, \
        previewLink, \
        infoLink, \
        link, \
            = fields
        
        department = Department.get_or_create(name=department)[0]  # type: Department
        authors = [Author.get_or_create(name=author)[0] for author in authors]  # type: List[Author]
        publisher = Publisher.get_or_create(name=publisher)[0]  # type: Publisher
        categories = [Category.get_or_create(name=category)[0] for category in categories]  # type: List[Category]
        language = Language.get_or_create(name=language)[0]  # type: Language
        
        isbn_book, created = super(IsbnBook, cls).get_or_create(
            isbn=isbn,
            department=department,
            title=title,
            publisher=publisher,
            publishedDate=publishedDate,
            description=description,
            pageCount=pageCount,
            averageRating=averageRating,
            ratingsCount=ratingsCount,
            image=image,
            language=language,
            previewLink=previewLink,
            infoLink=infoLink,
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
    
    @staticmethod
    def flatten_foreign_field(items, view):
        for field, value in view:
            if isinstance(value, dict):
                name = value.get("name")
                if "id" in value and name is not None:
                    items[field] = name
            if isinstance(value, list):
                IsbnBook.flatten_foreign_field(value, enumerate(value))
    
    @mark_override
    def to_dict(self, **kwargs):
        # type: () -> Json
        # filter fields that are {id, name} to just be name
        kwargs["manytomany"] = True
        isbn_book = super(IsbnBook, self).to_dict(**kwargs)
        self.flatten_foreign_field(isbn_book, isbn_book.viewitems())
        return isbn_book


IsbnBookAuthor = IsbnBook.authors.get_through_model()
IsbnBookCategory = IsbnBook.categories.get_through_model()


class Book(Model):
    barcode = TextField(primary_key=True)
    isbnBook = ForeignKeyField(IsbnBook, backref="books")
    owner = ForeignKeyField(User, backref="own_books")
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
            isbnBook=IsbnBook.get(isbn=isbn),
            owner=owner,
            lender=owner,
            borrower=owner,
        )
    
    @hybrid_property
    def isbn(self):
        # type: () -> unicode
        return self.isbn_book.isbn


class Transaction(Model):
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
    password = "5e9708d50aa3cef560fa6a6d47787e44aae25d19de9bb06a9f653939df82881b"  # SHA256 of "Sen"
    user, created = User.login_or_create(username, password)
    IsbnBook.get_or_create({
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
        "image": "http://books.google.com/books/content?id=i-bUBQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        "language": "en",
        "previewLink": "http://books.google.com/books?id=i-bUBQAAQBAJ&pg=PP1&dq=isbn:9780262033848&hl=&cd=1&source=gbs_api",
        "infoLink": "http://books.google.com/books?id=i-bUBQAAQBAJ&dq=isbn:9780262033848&hl=&source=gbs_api",
        "link": "https://books.google.com/books/about/Introduction_to_Algorithms.html?hl=&id=i-bUBQAAQBAJ",
    })
    print(user.add_book("123", "9780262033848"))
    
    print(user)
    print("Done")


setup_db()

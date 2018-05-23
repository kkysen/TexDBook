from peewee import CharField, IntegerField
from typing import Union

from TexDBook.src.python.core.models.Book import Book
from TexDBook.src.python.core.models.db import flask_db
from TexDBook.src.python.core.views.login import login_manager
from TexDBook.src.python.util.password import hash_password, verify_password


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

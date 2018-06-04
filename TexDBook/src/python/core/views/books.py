from flask_login import current_user
from typing import List, Tuple

from TexDBook.src.python.core.init_app import app, default_init_app
from TexDBook.src.python.core.login_manager import paranoid
from TexDBook.src.python.core.models import User, IsbnBook
from TexDBook.src.python.core.views.login import get_user
from TexDBook.src.python.util.flask.flask_utils_types import JsonOrMessage
from TexDBook.src.python.util.flask.rest_api import json, rest_api, rest_api_route, unpack_json, unpack_json_request
from TexDBook.src.python.util.types import Json

init_app = default_init_app


@rest_api_route(app, "/allIsbns")
def all_isbns():
    # type: () -> List[unicode]
    return list(IsbnBook.all_isbns())


@rest_api_route(app, "/ownBooks")
def own_books():
    # type: () -> List[Json]
    # TODO check if this causes N + 1 query
    user = get_user()
    return [{
        "barcode": book.barcode,
        "isbn": book.isbn_book.isbn,
    } for book in user.owned_books]


@rest_api_route(app, "/uploadBooks")
def upload_books():
    # type: () -> JsonOrMessage
    
    # TODO FIXME
    
    args = unpack_json_request("books")  # type: List[Json]
    if args is None:
        return "No books given"
    books = args[0]  # type: List[Json]
    for book in books:
        pass
    books_args = unpack_json(books, "barcodes", "isbns")
    if books_args is None:
        return "No barcodes or isbns given"
    barcodes, isbns = books_args  # type: List[unicode]
    # noinspection PyProtectedMember
    user = get_user()  # type: User
    added = [user.add_book(barcode, isbn) for barcode, isbn in zip(barcodes, isbns)]
    return {
        "books": {
            "barcodes": barcodes,
            "isbns": isbns,
            "added": added,
        },
    }

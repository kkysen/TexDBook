from typing import List, Tuple

from TexDBook.src.python.core.init_app import app, default_init_app
from TexDBook.src.python.core.login_manager import paranoid
from TexDBook.src.python.core.models import IsbnBook, User, db
from TexDBook.src.python.core.views.login import get_user
from TexDBook.src.python.util.flask.flask_utils_types import JsonOrMessage
from TexDBook.src.python.util.flask.rest_api import rest_api, rest_api_route, unpack_json, unpack_json_request
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


@rest_api
def add_book(user, book_json):
    # type: (User, Json) -> JsonOrMessage
    args = unpack_json(book_json, "isbn", "barcode")  # type: List[unicode, unicode]
    if args is None:
        return "No isbn or barcode given"
    isbn, barcode = args
    try:
        book, created = user.add_book(barcode, isbn)
        if not created:
            if book.isbn != isbn:
                return "Barcode {} already assigned to isbn {}".format(barcode, book.isbn)
            else:
                return "Book already exists with barcode {} and isbn {}".format(barcode, isbn)
        else:
            return {}
    except Exception as e:
        return e.message


@rest_api_route(app, "/uploadBooks")
def upload_books():
    # type: () -> JsonOrMessage
    args = unpack_json_request("csrfToken", "isbns", "books")  # type: Tuple[unicode, List[Json], List[Json]]
    if args is None:
        return "No csrfToken, isbns, or books given"
    csrf_token, isbns, books = args
    if csrf_token != paranoid.create_token():
        return "Invalid csrfToken"
    
    with db.atomic():
        for isbn in isbns:  # type: Json
            IsbnBook.get_or_create(isbn)
        
        user = get_user()
        response = {
            "books": [{
                "book": book,
                "response": add_book(user, book)
            } for book in books],
        }
        return response

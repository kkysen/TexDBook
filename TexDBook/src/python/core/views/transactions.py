from typing import Tuple

from TexDBook.src.python.core.init_app import app, default_init_app
from TexDBook.src.python.core.models import User, Book, Transaction
from TexDBook.src.python.core.views.login import get_user, rest_logged_in
from TexDBook.src.python.util.flask.flask_utils_types import JsonOrMessage
from TexDBook.src.python.util.flask.rest_api import rest_api_route, unpack_json_request

init_app = default_init_app


@rest_api_route(app, "/makeTransaction")
@rest_logged_in
def make_transaction():
    # type: () -> JsonOrMessage
    args = unpack_json_request("borrowing", "otherUserId", "barcode")  # type: Tuple[bool, int, unicode]
    if args is None:
        return "Invalid JSON"
    borrowing, other_user_id, barcode = args
    
    other_user = User.get_or_none(id=other_user_id)  # type: User
    if other_user is None:
        return "Invalid user ID"
    
    own_user = get_user()  # type: User
    if not own_user.is_admin:
        return "Must be admin to make a transaction"
    
    if borrowing:
        lender = other_user
        borrower = own_user
    else:
        lender = own_user
        borrower = other_user
    
    book = Book.get_or_none(barcode=barcode, borrower=lender)  # type: Book
    if book is None:
        return "Lender does not have the book"
    
    transaction = Transaction.create(book, borrower, 0)  # type: Transaction
    
    return transaction.to_dict()

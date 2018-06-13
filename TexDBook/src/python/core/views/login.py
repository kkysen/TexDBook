from functools import wraps

from flask_login import current_user, login_user, logout_user
from typing import List, Optional

from TexDBook.src.python.core.init_app import app, default_init_app
from TexDBook.src.python.core.models import User
from TexDBook.src.python.util.flask.flask_utils_types import JsonOrMessage
from TexDBook.src.python.util.flask.rest_api import RestApi, rest_api_route, unpack_json_request
from TexDBook.src.python.util.types import Args, Json, Kwargs

init_app = default_init_app


def rest_logged_in(route):
    # type: (RestApi) -> RestApi
    @wraps(route)
    def wrapper(*args, **kwargs):
        # type: (Args, Kwargs) -> JsonOrMessage
        user = get_user()
        print(user)
        if not user.is_authenticated:
            print("Not logged in")
            return "Not logged in"
        return route(*args, **kwargs)
    
    return wrapper


def login_user_from_request():
    # type: () -> JsonOrMessage
    args = unpack_json_request("username", "password")  # type: List[unicode]
    if args is None:
        return "No username or password given"
    username, password = args
    user = User.login(username, password)
    if user is None:
        return "Username or password wrong"
    login_user(user, remember=True)
    return {}


@rest_api_route(app, "/login")
def login():
    # type: () -> JsonOrMessage
    args = unpack_json_request("username", "password")  # type: List[unicode]
    if args is None:
        return "No username or password given"
    username, password = args
    user = User.login(username, password)
    if user is None:
        return "Username or password wrong"
    login_user(user, remember=True)
    return {}


@rest_api_route(app, "/logout")
@rest_logged_in
def logout():
    # type: () -> Json
    logged_out = logout_user()  # type: bool
    return {} if logged_out else "Logout failed"


@rest_api_route(app, "/createAccount")
def create_account():
    # type: () -> JsonOrMessage
    args = unpack_json_request("username", "password", "passwordConfirmation")  # type: List[unicode]
    if args is None:
        return "No username or password given"
    username, password, password_confirmation = args
    message = None  # type: Optional[str]
    if password != password_confirmation:
        message = "Passwords don't match"
    user, created = User.get_or_create(username=username, password=password)  # type: User, bool
    if not created:
        message = "Username \"{}\" already taken".format(username)
    if message is not None:
        return message
    return {}


def get_user():
    # type: () -> User
    # noinspection PyProtectedMember
    return current_user._get_current_object()

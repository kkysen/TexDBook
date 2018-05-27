from functools import wraps

from flask import Flask, jsonify, request
from flask_login import current_user, login_user, logout_user
from typing import Any, Dict, List, Optional, Union

from TexDBook.src.python.core.init_app import app, default_init_app
from TexDBook.src.python.core.models import User
from TexDBook.src.python.util.flask.flask_utils_types import Route, Router

init_app = default_init_app


def json(route):
    # type: (Route) -> Route
    @wraps(route)
    def wrapper(*args, **kwargs):
        return jsonify(route(*args, **kwargs))
    
    return wrapper


def rest_api(app, url):
    # type: (Flask, str) -> Router
    def router(route):
        # type: (Route) -> Route
        @app.route(url, methods=["POST"])
        @json
        @wraps(route)
        def wrapper(*args, **kwargs):
            return route(*args, **kwargs)
        
        return wrapper
    
    return router


def unpack_json_request(*fields):
    # type: (List[str]) -> Optional[List[Any]]
    data = request.get_json()  # type: Dict[unicode, Any]
    if data is None:
        return None
    values = []  # type: List[Any]
    sentinel = {}
    for field in map(unicode, fields):
        value = data.get(field, sentinel)
        if value is sentinel:
            return None
        values.append(value)
    return values


def login_user_from_request():
    # type: () -> Union[User, str]
    print(request.cookies)
    args = unpack_json_request("username", "password")  # type: List[unicode]
    if args is None:
        return "No username or password given"
    username, password = args
    user = User.login(username, password)
    if user is None:
        return "Username or password wrong"
    login_user(user, remember=True)
    return user


@rest_api(app, "/login")
def login():
    # type: () -> Dict[str, bool | str]
    user_or_message = login_user_from_request()
    if isinstance(user_or_message, str):
        return {
            "isLoggedIn": False,
            "message": user_or_message,
        }
    else:
        return {
            "isLoggedIn": True,
        }


@rest_api(app, "/logout")
def logout():
    # type: () -> Dict[str, bool]
    logged_out = not logout_user()  # type: bool
    return {
        "isLoggedIn": logged_out,
    }


def create_user():
    # type: () -> Union[User, str]
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
    return user


@rest_api(app, "/createAccount")
def create_account():
    # type: () -> Dict[str, bool | str]
    user_or_message = create_user()
    if isinstance(user_or_message, str):
        return {
            "didCreateAccount": False,
            "message": user_or_message,
        }
    else:
        return {
            "didCreateAccount": True,
        }

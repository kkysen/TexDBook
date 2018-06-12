from __future__ import print_function

import itsdangerous
from flask import Response, render_template, request
from flask_login import LoginManager
from flask_paranoid import Paranoid
from itsdangerous import Signer
from typing import Callable

from TexDBook.src.python.core.init_app import app, default_init_app
from TexDBook.src.python.util.flask.flask_utils_types import JsonOrMessage
from TexDBook.src.python.util.flask.rest_api import json, rest_api
from TexDBook.src.python.util.oop import override

init_app = default_init_app

login_manager = LoginManager()  # type: LoginManager
login_manager.init_app(app)

paranoid = Paranoid()  # type: Paranoid
paranoid.init_app(app)


@paranoid.on_invalid_session
def on_invalid_session():
    # type: () -> Response
    print("Invalid Session")
    print()
    # noinspection PyProtectedMember
    print("remote address: {}".format(paranoid._get_remote_addr()))
    print()
    print("create token: {}".format(paranoid.create_token()))
    print("session token: {}".format(paranoid.get_token_from_session()))
    
    if request.path == "/":
        return index()
    else:
        # noinspection PyTypeChecker
        return rest_api_on_invalid_session()


@json
@rest_api
def rest_api_on_invalid_session():
    # type: () -> JsonOrMessage
    return "Invalid Session"


@app.route("/")
def index():
    # type: () -> Response
    print("INDEX")
    # noinspection PyProtectedMember
    print("remote address: {}".format(paranoid._get_remote_addr()))
    # print(request.__dict__)
    return render_template("index.html", debug=app.debug, csrf_token=paranoid.create_token())


@override(itsdangerous)
def constant_time_compare(_super, actual, expected):
    # type: (Callable[[str, str], bool], str, str) -> bool
    print("expected: {}\n"
          "  actual: {}\n".format(expected, actual))
    return _super(expected, actual)


@override(Signer)
def derive_key(_super, self):
    # type: (Callable[[Signer], str], Signer) -> str
    key = _super(self)
    print("hash(app): {}".format(hash(app)))
    print("app.secret_key: {}".format(app.secret_key))
    print("derive_key: {}".format(key))
    print("key_derivation: {}".format(self.key_derivation))
    print("secret_key: {}".format(self.secret_key))
    print("digest_method: {}".format(self.digest_method))
    return key

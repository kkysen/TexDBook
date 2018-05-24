from flask import request
from flask_login import LoginManager, login_user
from typing import Dict

from TexDBook.src.python.core.init_app import app, default_init_app
from TexDBook.src.python.core.models import User


@app.route("/login")
def login():
    # type: () -> Dict[str, bool]
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    user = User.login(username, password)
    if user:
        login_user(None, remember=True)
    return {
        "isLoggedIn": user is not None,
    }
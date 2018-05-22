from flask import Response
from flask_login import LoginManager

from TexDBook.src.python.core.init_app import app, default_init_app

login_manager = LoginManager()  # type: LoginManager

login_manager.init_app(app)

init_app = default_init_app


@app.route("/login")
def login():
    # type: () -> Response
    pass
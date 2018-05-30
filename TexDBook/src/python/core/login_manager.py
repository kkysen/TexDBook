from flask_login import LoginManager
from flask_paranoid import Paranoid

from TexDBook.src.python.core.init_app import app, default_init_app
from TexDBook.src.python.util.flask.rest_api import rest_api

login_manager = LoginManager()  # type: LoginManager
login_manager.init_app(app)

paranoid = Paranoid()  # type: Paranoid
paranoid.init_app(app)


@paranoid.on_invalid_session
@rest_api
def on_invalid_session():
    # type: () -> str
    print("Invalid Session")
    return "Invalid Session"


init_app = default_init_app

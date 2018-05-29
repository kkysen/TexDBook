from flask_login import LoginManager
from flask_paranoid import Paranoid
from typing import Optional

from TexDBook.src.python.core.init_app import app, default_init_app
from TexDBook.src.python.util.oop import extend

login_manager = LoginManager()  # type: LoginManager
login_manager.init_app(app)

paranoid = Paranoid()  # type: Paranoid
paranoid.init_app(app)
paranoid.redirect_view = "/"


@extend(Paranoid)
def get_token(self):
    # type: (Paranoid) -> str
    token = self.get_token_from_session()  # type: Optional[str]
    if token is None:
        token = self.create_token()
        self.write_token_to_session(token)
    return token


init_app = default_init_app

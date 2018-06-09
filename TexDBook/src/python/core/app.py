from __future__ import print_function

from flask import Flask
from typing import Tuple

from TexDBook.src.python.core import login_manager, models, static_gzip
from TexDBook.src.python.core.init_app import NAME, app
from TexDBook.src.python.core.views import books, data, index, login, users
from TexDBook.src.python.util.flask.template_context import add_template_context


def create_app():
    # type: () -> Tuple[Flask, str]
    for module in [models, login_manager, index, static_gzip, data, login, books, users]:
        module.init_app(app)
    add_template_context(app)
    return app, NAME

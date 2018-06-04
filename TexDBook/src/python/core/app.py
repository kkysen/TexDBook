from __future__ import print_function

from flask import Flask
from typing import Tuple

from TexDBook.src.python.core import login_manager, models
from TexDBook.src.python.core.init_app import NAME, app
from TexDBook.src.python.core.views import books, data, index, login
from TexDBook.src.python.util.flask.template_context import add_template_context


def create_app():
    # type: () -> Tuple[Flask, str]
    for module in [models, login_manager, index, data, login, books]:
        module.init_app(app)
    add_template_context(app)
    return app, NAME

from __future__ import print_function

import time

from flask import Flask
from typing import Tuple

from TexDBook.src.python.core import login_manager, models
from TexDBook.src.python.core.init_app import NAME, app
from TexDBook.src.python.core.views import data, index, login, books
from TexDBook.src.python.util.flask.template_context import add_template_context


@app.route("/long")
def long_request():
    # type: () -> str
    time.sleep(10)
    return "Long"


@app.route("/short")
def short_request():
    # type: () -> str
    return "Short"


def create_app():
    # type: () -> Tuple[Flask, str]
    for module in [models, login_manager, index, data, login, books]:
        module.init_app(app)
    add_template_context(app)
    return app, NAME

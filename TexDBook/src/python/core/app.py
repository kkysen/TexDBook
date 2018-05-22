from __future__ import print_function

import time

from flask import Flask
from typing import Tuple

from TexDBook.src.python.core.init_app import NAME, app
from TexDBook.src.python.core.models import db
from TexDBook.src.python.core.views import data, index, login


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
    for module in [db, index, data, login]:
        module.init_app(app)
    return app, NAME

from __future__ import print_function

import time

import os
from flask import Flask, Response, render_template, send_file
from peewee import Database
from playhouse.flask_utils import FlaskDB
from typing import Tuple

from TexDBook.src.python.core.init import NAME, resolve_path
from TexDBook.src.python.util.log import log

app = Flask(
    import_name=__name__,
    root_path=os.path.abspath(resolve_path("..", "dist")),
    template_folder="",
    static_folder="",
    static_url_path=""
)  # type: Flask
app.config.from_object(__name__)
flask_db = FlaskDB(app)  # type: FlaskDB
db = flask_db.database  # type: Database


@app.route("/")
def index():
    # type: () -> Response
    log.debug("index")
    # map(print, app.url_map.iter_rules())
    return render_template("index.html")


def make_data_route(app, route, path, mime_type=None):
    # type: (Flask, str, str, str) -> None
    def data():
        # type: () -> Response
        log.debug(route)
        print(route)
        return send_file(os.path.abspath(path), mimetype=mime_type)
    
    data.func_name = route
    app.route("/" + route)(data)


def make_file_data_route(filename, dir, prefix=""):
    # type: (str, str) -> None
    dir = "../" + dir
    _, extension = filename.split(".")
    route = filename
    mime_type = {
        "bin": "application/octet-stream",
        "csv": "text/csv",
        "wasm": "application/wasm",
        "svg": "image/svg+xml",
        "json": "application/json",
        "ico": "image/vnd.microsoft.icon",
    }[extension]
    path = dir + "/" + filename
    if prefix:
        route = prefix + "/" + route
    make_data_route(app, route, path, mime_type)


make_file_data_route("favicon.ico", "data")


@app.route("/long")
def long_request():
    # type: () -> str
    log.debug("long")
    time.sleep(10)
    return "Long"


@app.route("/short")
def short_request():
    # type: () -> str
    log.debug("short")
    return "Short"


def create_app():
    # type: () -> Tuple[Flask, str]
    app.secret_key = os.urandom(32)
    
    if False:
        app.debug = True
    
    log.debug(app)
    log.debug(NAME)
    
    return app, NAME

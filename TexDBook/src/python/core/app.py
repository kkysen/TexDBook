from __future__ import print_function

import os
import shutil

from flask import Flask, Response, render_template, send_file
from typing import Tuple, List

NAME = "TexDBook"

app = Flask(
    import_name=__name__,
    root_path=os.path.abspath("../../dist"),
    template_folder="",
    static_folder="",
    static_url_path=""
)  # type: Flask


def get_relative_dir():
    # type: () -> List[str]
    cwd = os.getcwd()
    parts = cwd.split(os.sep)
    return parts[:parts.index(NAME)] + ["TexDBook", "TexDBook", "src"]


RELATIVE_DIR = get_relative_dir()  # type: List[str]


def resolve_path(*path_components):
    # type: (Tuple[str]) -> str
    return os.sep.join(RELATIVE_DIR + list(path_components))


@app.route("/")
def index():
    # type: () -> Response
    # map(print, app.url_map.iter_rules())
    return render_template("index.html")


def make_data_route(app, route, path, mime_type=None):
    # type: (Flask, str, str, str) -> None
    def data():
        # type: () -> Response
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


def make_favicon():
    # type: () -> None
    shutil.copyfile(resolve_path("data", "CLRS.jpg"), resolve_path("data", "favicon.ico"))
    make_file_data_route("favicon.ico", "data")


def create_app():
    # type: () -> Tuple[Flask, str]
    app.secret_key = os.urandom(32)
    app.debug = True
    
    make_favicon()
    
    return app, NAME
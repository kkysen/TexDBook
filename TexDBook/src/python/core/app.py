from __future__ import print_function

import os
import shutil

from flask import Flask, Response, render_template, send_file
from typing import Tuple, List, T

NAME = "TexDBook"

app = Flask(
    import_name=__name__,
    root_path=os.path.abspath("../../dist"),
    template_folder="",
    static_folder="",
    static_url_path=""
)  # type: Flask


def index_from_end(list, e, nth):
    # type: (List[T], T, int) -> int
    if nth <= 0:
        return -1
    i = len(list) - 1
    while i >= 0 and nth > 0:
        while i >= 0 and list[i] != e:
            i = i - 1
        nth = nth - 1
    return i


def get_relative_dir():
    # type: () -> List[str]
    cwd = os.getcwd()  # type: str
    parts = cwd.split(os.sep)  # type: List[str]
    return parts[:index_from_end(parts, NAME, 2)] + ["TexDBook", "TexDBook", "src"]


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

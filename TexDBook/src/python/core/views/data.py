import os
from flask import Flask, Response, send_file

from TexDBook.src.python.core.init_app import app, default_init_app, resolve_path


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
    # dir = "../" + dir
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
    path = resolve_path(dir, filename)
    if prefix:
        route = prefix + "/" + route
    make_data_route(app, route, path, mime_type)


make_file_data_route("favicon.ico", "data")

init_app = default_init_app

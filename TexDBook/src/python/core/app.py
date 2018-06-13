from __future__ import print_function

from flask import Flask

from TexDBook.src.python.core import login_manager, models, static_gzip
from TexDBook.src.python.core.init_app import NAME, app, resolve_path
from TexDBook.src.python.core.views import books, data, login, users
from TexDBook.src.python.util.flask.template_context import add_template_context


app_name = NAME  # type: str

secret_key_path = resolve_path("data", "secret_key.txt")


def create_app():
    # type: () -> Flask
    
    with open(secret_key_path) as secret_key:
        app.secret_key = secret_key.read()
    
    app.debug = True
    
    for module in [models, login_manager, static_gzip, data, login, books, users]:
        module.init_app(app)
    
    add_template_context(app)
    
    return app

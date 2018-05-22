from flask import Response, render_template

from TexDBook.src.python.core.init_app import app, default_init_app


@app.route("/")
def index():
    # type: () -> Response
    # map(print, app.url_map.iter_rules())
    return render_template("index.html")


init_app = default_init_app

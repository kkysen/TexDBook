from flask import Response, render_template

from TexDBook.src.python.core.init_app import app, default_init_app


@app.route("/")
def index():
    # type: () -> Response
    return render_template("index.html", debug=app.debug)


init_app = default_init_app

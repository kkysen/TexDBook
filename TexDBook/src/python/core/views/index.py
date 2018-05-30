from flask import Response, render_template, request

from TexDBook.src.python.core.init_app import app, default_init_app
from TexDBook.src.python.core.login_manager import paranoid


@app.route("/")
def index():
    # type: () -> Response
    print("\tINDEX\t")
    print(request.__dict__)
    return render_template("index.html", debug=app.debug, csrf_token=paranoid.create_token())


init_app = default_init_app

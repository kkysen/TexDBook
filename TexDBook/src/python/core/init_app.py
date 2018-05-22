import os
from flask import Flask

from typing import List, Tuple

NAME = "TexDBook"


def get_relative_dir():
    # type: () -> List[str]
    print(__file__)
    parts = __file__.split(os.sep)  # type: List[str]
    return parts[:parts.index(NAME)] + ["TexDBook", "TexDBook", "src"]


RELATIVE_DIR = get_relative_dir()  # type: List[str]


def resolve_path(*path_components):
    # type: (Tuple[str]) -> str
    return os.sep.join(RELATIVE_DIR + list(path_components))


app = Flask(
    import_name=__name__,
    root_path=os.path.abspath(resolve_path("..", "dist")),
    template_folder="",
    static_folder="",
    static_url_path="",
)  # type: Flask

app.secret_key = os.urandom(32)

app.debug = True


def default_init_app(app):
    # type: (Flask) -> None
    pass

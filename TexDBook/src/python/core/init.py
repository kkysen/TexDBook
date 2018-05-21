import os

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
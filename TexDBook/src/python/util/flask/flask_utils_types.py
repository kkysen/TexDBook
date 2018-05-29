from flask import Response
from typing import Callable, Union

from TexDBook.src.python.util.types import Json

Precondition = Union[Callable[[], bool], callable]
Route = Union[Callable[[], Response], callable]
Router = Callable[[Route], Route]
RestRoute = Callable[[], Json]
JsonOrMessage = Union[Json, str]
InnerRestRoute = Callable[[], Union[Json, str]]
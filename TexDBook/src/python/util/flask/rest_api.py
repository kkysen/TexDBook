from functools import wraps

from flask import Flask, jsonify, request
from typing import Any, List, Optional, Union

from TexDBook.src.python.util.flask.flask_utils_types import InnerRestRoute, RestRoute, Route, Router
from TexDBook.src.python.util.types import Json


def json(route):
    # type: (Route) -> Route
    @wraps(route)
    def wrapper(*args, **kwargs):
        return jsonify(route(*args, **kwargs))
    
    return wrapper


def rest_api(route):
    # type: (InnerRestRoute) -> RestRoute
    @json
    @wraps(route)
    def wrapper(*args, **kwargs):
        # type: () -> Json
        # noinspection PyArgumentList
        response_or_message = route(*args, **kwargs)  # type: Union[Json, str]
        if isinstance(response_or_message, str):
            return {
                "success": False,
                "message": response_or_message,
            }
        else:
            return {
                "success": True,
                "response": response_or_message,
            }
    
    return wrapper


def rest_api_route(app, url):
    # type: (Flask, str) -> Router
    def router(route):
        # type: (InnerRestRoute) -> RestRoute
        return app.route(url, methods=["POST"])(rest_api(route))
    
    return router


def unpack_json(json, *fields):
    # type: (Json, List[str]) -> Optional[List[Any]]
    if json is None:
        return None
    values = []  # type: List[Any]
    sentinel = {}
    for field in map(unicode, fields):
        value = json.get(field, sentinel)
        if value is sentinel:
            return None
        values.append(value)
    return values


def unpack_json_request(*fields):
    # type: (List[str]) -> Optional[List[Any]]
    return unpack_json(request.get_json(), *fields)
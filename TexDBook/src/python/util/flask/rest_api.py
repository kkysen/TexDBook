from functools import wraps

from flask import Flask, Response, jsonify, request
from typing import Any, Callable, List, Optional

from TexDBook.src.python.util.flask.flask_utils_types import JsonOrMessage, RestRoute, Route, Router
from TexDBook.src.python.util.types import Args, Json, Kwargs

RestApi = Callable[[Args, Kwargs], JsonOrMessage]


def json(route):
    # type: (Route) -> Route
    @wraps(route)
    def wrapper(*args, **kwargs):
        # type: (Args, Kwargs) -> Response
        json_obj = route(*args, **kwargs)  # type: Json
        json_response = jsonify(json_obj)  # type: Response
        print(json_response)
        return json_response
    
    return wrapper


def rest_api(route):
    # type: (RestApi) -> RestRoute
    @wraps(route)
    def wrapper(*args, **kwargs):
        # type: (Args, Kwargs) -> Json
        print("API")
        response_or_message = route(*args, **kwargs)  # type: JsonOrMessage
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
        # type: (RestApi) -> RestRoute
        @app.route(url, methods=["POST"])
        @json
        @rest_api
        @wraps(route)
        def wrapper(*args, **kwargs):
            # type: (Args, Kwargs) -> JsonOrMessage
            return route(*args, **kwargs)
        
        return wrapper
    
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

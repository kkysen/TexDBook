from __future__ import print_function

from functools import wraps
from pprint import pformat

import itsdangerous
from flask import Flask, Response, jsonify, request, session
# noinspection PyProtectedMember
from flask.globals import _request_ctx_stack
from itsdangerous import Signer
from typing import Any, Callable, List, Optional

from TexDBook.src.python.util.flask.flask_utils_types import JsonOrMessage, RestRoute, Route, Router
from TexDBook.src.python.util.oop import override
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
        print("\n\n{}: {}\n\n".format("BEGIN", request.path))
        for name, value in {
            "request.environ": request.environ,
            "request.headers": str(request.headers),
            "request.cookies": request.cookies,
            "session": session,
            "_request_ctx_stack.top.session": _request_ctx_stack.top.session,
        }.viewitems():
            print("\n\n{}:\n\n{}\n\n".format(name, value if isinstance(value, str) else pformat(value)))
        response_or_message = route(*args, **kwargs)  # type: JsonOrMessage
        print("\n\n{}: {}\n\n".format("END", request.path))
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


@override(itsdangerous)
def constant_time_compare(_super, expected, actual):
    # type: (Callable[[str, str], bool], str, str) -> bool
    print("expected: {}\n"
          "  actual: {}\n".format(expected, actual))
    return _super(expected, actual)


@override(Signer)
def derive_key(_super, self):
    # type: (Callable[[Signer], str], Signer) -> str
    key = _super(self)
    print("derive_key: {}".format(key))
    print("key_derivation: {}".format(self.key_derivation))
    print("secret_key: {}".format(self.secret_key))
    print("digest_method: {}".format(self.digest_method))
    return key

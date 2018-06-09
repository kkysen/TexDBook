from TexDBook.src.python.core.init_app import app, default_init_app
from TexDBook.src.python.core.models import User
from TexDBook.src.python.core.views.login import rest_logged_in
from TexDBook.src.python.util.flask.rest_api import rest_api_route
from TexDBook.src.python.util.types import Json

init_app = default_init_app


@rest_api_route(app, "/allUsers")
@rest_logged_in
def all_users():
    # type: () -> Json
    return {
        "users": [user.to_dict() for user in User.all_users()]
    }

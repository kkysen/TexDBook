from peewee import Database, SqliteDatabase
from playhouse.flask_utils import FlaskDB

from TexDBook.src.python.core.init_app import NAME, app, default_init_app, resolve_path

app.config.from_object(__name__)

db = SqliteDatabase(resolve_path("data", NAME + ".db"))  # type: Database

flask_db = FlaskDB(app, db)  # type: FlaskDB

init_app = default_init_app

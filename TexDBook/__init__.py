from flask import Flask
from typing import Tuple

from src.python import app


def create_app():
    # type: () -> Tuple[Flask, str]
    return app.create_app()


if __name__ == '__main__':
    create_app()[0].run()

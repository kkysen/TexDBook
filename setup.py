import os

from TexDBook import app_name
from TexDBook.src.python.core.app import secret_key_path

name = app_name

domain = "206.189.226.167"


def make_apache_conf_file():
    # type: () -> None
    template_name = "template.conf"
    for filename in os.listdir("."):
        if filename.endswith(".conf") and filename != template_name:
            os.remove(filename)
    template = open(template_name).read()
    template = template \
        .replace("${AppName}", name) \
        .replace("${Domain}", domain)
    open(name + ".conf", "w").write(template)


def make_secret_key():
    # type: () -> None
    with open(secret_key_path, "w") as secret_key:
        secret_key.write(os.urandom(32))


if __name__ == '__main__':
    make_apache_conf_file()
    make_secret_key()

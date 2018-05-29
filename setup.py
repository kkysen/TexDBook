import os

from TexDBook import create_app

application, name = create_app()

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


if __name__ == '__main__':
    make_apache_conf_file()

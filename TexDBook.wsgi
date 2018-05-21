#!/usr/bin/python

from __future__ import print_function

import sys

print(__file__)
print(sys.path)

from TexDBook import create_app

application, name = create_app()

sys.path.insert(0, "/var/www/" + name)

print(application)

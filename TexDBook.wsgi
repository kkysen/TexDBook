#!/usr/bin/python

from __future__ import print_function

import sys

import os

sys.path.insert(0, os.path.dirname(__file__))

from TexDBook import create_app

application, name = create_app()
application.debug = False

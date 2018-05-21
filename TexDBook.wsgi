#!/usr/bin/python

from __future__ import print_function

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from TexDBook import create_app

application, name = create_app()

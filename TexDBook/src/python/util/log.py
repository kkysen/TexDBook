from __future__ import print_function

import logging
import os
from logging import Logger

from TexDBook.src.python.core.init import NAME

log_path = "/var/log/apache2/TexDBook.log"

if False:
    os.open(log_path, os.O_RDWR | os.O_CREAT, 0o666)
    
    logging.basicConfig(filename=log_path)
    
    log = logging.getLogger(NAME)  # type: Logger


class FakeLog(object):
    
    def __init__(self):
        pass
    
    def debug(self, *args, **kwargs):
        print(*args, **kwargs)


log = FakeLog()
import logging
import os
from logging import Logger

from TexDBook.src.python.core.init import NAME

log_path = "/var/log/apache2/TexDBook.log"

os.open(log_path, os.O_RDWR | os.O_CREAT, 0o666)

logging.basicConfig(filename=log_path)

log = logging.getLogger(NAME)  # type: Logger

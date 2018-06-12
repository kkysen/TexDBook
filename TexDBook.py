import sys
from multiprocessing import freeze_support

from TexDBook import create_app

app, name = create_app()

if __name__ == '__main__':
    if sys.platform == "win32":
        freeze_support()
    app.run(debug=True)

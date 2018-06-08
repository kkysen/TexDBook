from TexDBook.src.python.util.types import Decorator, Function


def named(name):
    # type: (str) -> Decorator
    def decorator(func):
        # type: (Function) -> Function
        func.func_name = name
        return func
    
    return decorator

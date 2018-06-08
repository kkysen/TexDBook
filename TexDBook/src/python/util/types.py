from typing import Union, Callable, Dict, Any, AnyStr

Json = Dict[AnyStr, Any]

Function = Union[Callable, callable]

Decorator = Callable[[Function], Function]
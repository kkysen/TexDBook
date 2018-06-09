from typing import Union, Callable, Dict, Any, AnyStr, List

Json = Dict[AnyStr, Any]

Function = Union[Callable, callable]

Decorator = Callable[[Function], Function]
Args = List[Any]
Kwargs = Dict[str, Any]
from functools import wraps

from flask import session

from utils.respuestas import error


def login_required(f):
    """Deja pasar solo si hay una sesión iniciada (si no, 401)."""
    @wraps(f)
    def decorada(*args, **kwargs):
        if "user_id" not in session:
            return error("Necesitás iniciar sesión", 401)
        return f(*args, **kwargs)
    return decorada


def roles_required(*roles):
    """Deja pasar solo a los roles indicados (sin sesión 401, rol incorrecto 403)."""
    def decorador(f):
        @wraps(f)
        def decorada(*args, **kwargs):
            if "user_id" not in session:
                return error("Necesitás iniciar sesión", 401)
            if session.get("rol") not in roles:
                return error("No tenés permisos para realizar esta acción", 403)
            return f(*args, **kwargs)
        return decorada
    return decorador


admin_required = roles_required("admin")
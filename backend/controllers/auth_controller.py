from flask import jsonify, request, session
from sqlalchemy import func

from models.cuentas import Cuenta
from models.db import db
from utils.respuestas import error


def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return error("Email y contraseña son obligatorios", 400)

    cuenta = Cuenta.query.filter(func.lower(Cuenta.email) == email).first()
    # Mismo mensaje si falla el email o la contraseña (no se da pistas)
    if not cuenta or not cuenta.check_password(password):
        return error("Email o contraseña incorrectos", 401)

    session.clear()
    session["user_id"] = cuenta.id
    session["rol"] = cuenta.rol
    return jsonify({"mensaje": "Inicio de sesión correcto",
                    "usuario": cuenta.serialize()}), 200


def logout():
    session.clear()
    return jsonify({"mensaje": "Sesión cerrada correctamente"}), 200


def me():
    """Devuelve la cuenta con sesión iniciada (el frontend lo usa al recargar)."""
    cuenta = db.session.get(Cuenta, session["user_id"])
    if not cuenta:
        session.clear()
        return error("Necesitás iniciar sesión", 401)
    return jsonify(cuenta.serialize()), 200
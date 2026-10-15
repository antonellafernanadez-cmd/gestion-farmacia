import re

from flask import jsonify, request

from models.db import db
from models.empleados import Empleado
from utils.respuestas import error

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _validar(data, id_actual=None):
    """Devuelve (datos_limpios, None, None) o (None, mensaje, código)."""
    limpio = {c: (data.get(c) or "").strip()
              for c in ("nombre", "apellido", "dni", "email", "cargo", "domicilio")}

    for campo in ("nombre", "apellido", "dni", "cargo"):
        if not limpio[campo]:
            return None, f"El campo {campo} es obligatorio", 400
    if not limpio["dni"].isdigit() or not 7 <= len(limpio["dni"]) <= 8:
        return None, "El DNI debe tener 7 u 8 números", 400
    if not limpio["email"] or not EMAIL_RE.match(limpio["email"]):
        return None, "El email no es válido", 400

    # DNI y email únicos (ignorando al propio empleado cuando se modifica)
    for campo, texto in (("dni", "DNI"), ("email", "email")):
        consulta = Empleado.query.filter(getattr(Empleado, campo) == limpio[campo])
        if id_actual:
            consulta = consulta.filter(Empleado.id != id_actual)
        if consulta.first():
            return None, f"Ya existe un empleado con ese {texto}", 409

    limpio["domicilio"] = limpio["domicilio"] or None
    return limpio, None, None


def listar():
    empleados = Empleado.query.order_by(Empleado.apellido, Empleado.nombre).all()
    return jsonify([e.serialize() for e in empleados]), 200


def obtener(id):
    empleado = db.session.get(Empleado, id)
    if not empleado:
        return error("Empleado no encontrado", 404)
    return jsonify(empleado.serialize()), 200


def crear():
    datos, msg, codigo = _validar(request.get_json(silent=True) or {})
    if msg:
        return error(msg, codigo)
    empleado = Empleado(**datos)
    db.session.add(empleado)
    db.session.commit()
    return jsonify({"mensaje": "Empleado creado correctamente",
                    "empleado": empleado.serialize()}), 201


def modificar(id):
    empleado = db.session.get(Empleado, id)
    if not empleado:
        return error("Empleado no encontrado", 404)
    datos, msg, codigo = _validar(request.get_json(silent=True) or {}, id_actual=id)
    if msg:
        return error(msg, codigo)
    for campo, valor in datos.items():
        setattr(empleado, campo, valor)
    db.session.commit()
    return jsonify({"mensaje": "Empleado modificado correctamente",
                    "empleado": empleado.serialize()}), 200


def eliminar(id):
    empleado = db.session.get(Empleado, id)
    if not empleado:
        return error("Empleado no encontrado", 404)
    db.session.delete(empleado)
    db.session.commit()
    return jsonify({"mensaje": "Empleado eliminado correctamente"}), 200
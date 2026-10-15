from flask import jsonify, request
from models.db import db
from models.empleados import Empleado
from utils.respuestas import error


def listar():
    empleados = Empleado.query.order_by(Empleado.apellido, Empleado.nombre).all()
    return jsonify([e.serialize() for e in empleados]), 200


def obtener(id):
    empleado = db.session.get(Empleado, id)
    if not empleado:
        return error("Empleado no encontrado", 404)
    return jsonify(empleado.serialize()), 200


def crear():
    data = request.get_json(silent=True) or {}
    empleado = Empleado(
        nombre=data.get("nombre"),
        apellido=data.get("apellido"),
        dni=data.get("dni"),
        email=data.get("email"),
        cargo=data.get("cargo"),
        domicilio=data.get("domicilio"),
    )
    db.session.add(empleado)
    db.session.commit()
    return jsonify({"mensaje": "Empleado creado correctamente",
                    "empleado": empleado.serialize()}), 201


def modificar(id):
    empleado = db.session.get(Empleado, id)
    if not empleado:
        return error("Empleado no encontrado", 404)
    data = request.get_json(silent=True) or {}
    for campo in ("nombre", "apellido", "dni", "email", "cargo", "domicilio"):
        if campo in data:
            setattr(empleado, campo, data[campo])
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
from datetime import date
from flask import jsonify, request
from models.db import db
from models.medicamentos import Medicamento
from utils.respuestas import error


def listar():
    medicamentos = Medicamento.query.order_by(Medicamento.nombre).all()
    return jsonify([m.serialize() for m in medicamentos]), 200


def obtener(id):
    medicamento = db.session.get(Medicamento, id)
    if not medicamento:
        return error("Medicamento no encontrado", 404)
    return jsonify(medicamento.serialize()), 200


def crear():
    data = request.get_json(silent=True) or {}
    fecha = data.get("fecha_vencimiento")
    medicamento = Medicamento(
        nombre=data.get("nombre"),
        laboratorio=data.get("laboratorio"),
        precio=data.get("precio"),
        stock=data.get("stock"),
        categoria_id=data.get("categoria_id"),
        fecha_vencimiento=date.fromisoformat(fecha) if fecha else None,
    )
    db.session.add(medicamento)
    db.session.commit()
    return jsonify({"mensaje": "Medicamento creado correctamente",
                    "medicamento": medicamento.serialize()}), 201


def modificar(id):
    medicamento = db.session.get(Medicamento, id)
    if not medicamento:
        return error("Medicamento no encontrado", 404)
    data = request.get_json(silent=True) or {}
    for campo in ("nombre", "laboratorio", "precio", "stock", "categoria_id"):
        if campo in data:
            setattr(medicamento, campo, data[campo])
    if "fecha_vencimiento" in data:
        f = data["fecha_vencimiento"]
        medicamento.fecha_vencimiento = date.fromisoformat(f) if f else None
    db.session.commit()
    return jsonify({"mensaje": "Medicamento modificado correctamente",
                    "medicamento": medicamento.serialize()}), 200


def eliminar(id):
    medicamento = db.session.get(Medicamento, id)
    if not medicamento:
        return error("Medicamento no encontrado", 404)
    db.session.delete(medicamento)
    db.session.commit()
    return jsonify({"mensaje": "Medicamento eliminado correctamente"}), 200
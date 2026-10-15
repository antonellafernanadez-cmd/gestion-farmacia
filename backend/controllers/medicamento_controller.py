from datetime import datetime
from decimal import Decimal, InvalidOperation
from flask import jsonify, request
from models.categorias import Categoria
from models.db import db
from models.medicamentos import Medicamento
from utils.respuestas import error


def _validar(data):
    """Devuelve (datos_limpios, None) o (None, mensaje_de_error)."""
    nombre = (data.get("nombre") or "").strip()
    if not nombre:
        return None, "El nombre es obligatorio"

    try:
        precio = Decimal(str(data.get("precio")))
        if not precio.is_finite():
            raise InvalidOperation
    except (InvalidOperation, TypeError):
        return None, "El precio debe ser un número"
    if precio <= 0:
        return None, "El precio debe ser mayor a 0"

    try:
        stock = int(data.get("stock"))
    except (TypeError, ValueError):
        return None, "El stock debe ser un número entero"
    if stock < 0:
        return None, "El stock no puede ser negativo"

    if not data.get("categoria_id"):
        return None, "La categoría es obligatoria"
    try:
        categoria_id = int(data.get("categoria_id"))
    except (TypeError, ValueError):
        return None, "La categoría no es válida"
    if not db.session.get(Categoria, categoria_id):
        return None, "La categoría no existe"

    fecha = None
    if data.get("fecha_vencimiento"):
        try:
            fecha = datetime.strptime(data["fecha_vencimiento"], "%Y-%m-%d").date()
        except (ValueError, TypeError):
            return None, "La fecha no es válida (formato AAAA-MM-DD)"

    laboratorio = (data.get("laboratorio") or "").strip() or None
    return {"nombre": nombre, "laboratorio": laboratorio, "precio": precio,
            "stock": stock, "categoria_id": categoria_id,
            "fecha_vencimiento": fecha}, None


def listar():
    medicamentos = Medicamento.query.order_by(Medicamento.nombre).all()
    return jsonify([m.serialize() for m in medicamentos]), 200


def obtener(id):
    medicamento = db.session.get(Medicamento, id)
    if not medicamento:
        return error("Medicamento no encontrado", 404)
    return jsonify(medicamento.serialize()), 200


def crear():
    datos, msg = _validar(request.get_json(silent=True) or {})
    if msg:
        return error(msg, 400)
    medicamento = Medicamento(**datos)
    db.session.add(medicamento)
    db.session.commit()
    return jsonify({"mensaje": "Medicamento creado correctamente",
                    "medicamento": medicamento.serialize()}), 201


def modificar(id):
    medicamento = db.session.get(Medicamento, id)
    if not medicamento:
        return error("Medicamento no encontrado", 404)
    datos, msg = _validar(request.get_json(silent=True) or {})
    if msg:
        return error(msg, 400)
    for campo, valor in datos.items():
        setattr(medicamento, campo, valor)
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
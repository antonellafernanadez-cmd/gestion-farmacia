from flask import jsonify, request
from sqlalchemy import func
from models.categorias import Categoria
from models.db import db
from utils.respuestas import error


def _validar(data, id_actual=None):
    nombre = (data.get("nombre") or "").strip()
    if not nombre:
        return None, "El nombre es obligatorio", 400

    # No permite categorias duplicadas
    consulta = Categoria.query.filter(func.lower(Categoria.nombre) == nombre.lower())
    if id_actual:
        consulta = consulta.filter(Categoria.id != id_actual)
    if consulta.first():
        return None, "Ya existe una categoría con ese nombre", 409

    descripcion = (data.get("descripcion") or "").strip() or None
    return {"nombre": nombre, "descripcion": descripcion}, None, None


def listar():
    categorias = Categoria.query.order_by(Categoria.nombre).all()
    return jsonify([c.serialize() for c in categorias]), 200


def obtener(id):
    categoria = db.session.get(Categoria, id)
    if not categoria:
        return error("Categoría no encontrada", 404)
    return jsonify(categoria.serialize()), 200


def crear():
    datos, msg, codigo = _validar(request.get_json(silent=True) or {})
    if msg:
        return error(msg, codigo)
    categoria = Categoria(**datos)
    db.session.add(categoria)
    db.session.commit()
    return jsonify({"mensaje": "Categoría creada correctamente",
                    "categoria": categoria.serialize()}), 201


def modificar(id):
    categoria = db.session.get(Categoria, id)
    if not categoria:
        return error("Categoría no encontrada", 404)
    datos, msg, codigo = _validar(request.get_json(silent=True) or {}, id_actual=id)
    if msg:
        return error(msg, codigo)
    categoria.nombre = datos["nombre"]
    categoria.descripcion = datos["descripcion"]
    db.session.commit()
    return jsonify({"mensaje": "Categoría modificada correctamente",
                    "categoria": categoria.serialize()}), 200


def eliminar(id):
    categoria = db.session.get(Categoria, id)
    if not categoria:
        return error("Categoría no encontrada", 404)
    if categoria.medicamentos:
        return error("No se puede eliminar: la categoría tiene medicamentos", 409)
    db.session.delete(categoria)
    db.session.commit()
    return jsonify({"mensaje": "Categoría eliminada correctamente"}), 200
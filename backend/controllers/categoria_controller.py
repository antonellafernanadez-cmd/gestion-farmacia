from flask import jsonify, request

from models.categorias import Categoria
from models.db import db
from utils.respuestas import error


def listar():
    categorias = Categoria.query.order_by(Categoria.nombre).all()
    return jsonify([c.serialize() for c in categorias]), 200


def obtener(id):
    categoria = db.session.get(Categoria, id)
    if not categoria:
        return error("Categoría no encontrada", 404)
    return jsonify(categoria.serialize()), 200


def crear():
    data = request.get_json(silent=True) or {}
    categoria = Categoria(nombre=data.get("nombre"),
                          descripcion=data.get("descripcion"))
    db.session.add(categoria)
    db.session.commit()
    return jsonify({"mensaje": "Categoría creada correctamente",
                    "categoria": categoria.serialize()}), 201


def modificar(id):
    categoria = db.session.get(Categoria, id)
    if not categoria:
        return error("Categoría no encontrada", 404)
    data = request.get_json(silent=True) or {}
    categoria.nombre = data.get("nombre", categoria.nombre)
    categoria.descripcion = data.get("descripcion", categoria.descripcion)
    db.session.commit()
    return jsonify({"mensaje": "Categoría modificada correctamente",
                    "categoria": categoria.serialize()}), 200


def eliminar(id):
    categoria = db.session.get(Categoria, id)
    if not categoria:
        return error("Categoría no encontrada", 404)
    db.session.delete(categoria)
    db.session.commit()
    return jsonify({"mensaje": "Categoría eliminada correctamente"}), 200
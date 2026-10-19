from datetime import date, timedelta

from flask import jsonify

from models.categorias import Categoria
from models.empleados import Empleado
from models.medicamentos import Medicamento

STOCK_BAJO = 5       # "stock bajo" hasta esta cantidad
DIAS_POR_VENCER = 30   # "por vencer" dentro de estos días


def resumen():
    limite = date.today() + timedelta(days=DIAS_POR_VENCER)

    stock_bajo = (Medicamento.query
                  .filter(Medicamento.stock <= STOCK_BAJO)
                  .order_by(Medicamento.stock).all())
    por_vencer = (Medicamento.query
                  .filter(Medicamento.fecha_vencimiento.isnot(None),
                          Medicamento.fecha_vencimiento <= limite)
                  .order_by(Medicamento.fecha_vencimiento).all())

    return jsonify({
        "medicamentos": Medicamento.query.count(),
        "categorias": Categoria.query.count(),
        "empleados": Empleado.query.count(),
        "stock_bajo": [m.serialize() for m in stock_bajo],
        "por_vencer": [m.serialize() for m in por_vencer],
    }), 200
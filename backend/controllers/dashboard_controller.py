from flask import jsonify

from models.categorias import Categoria
from models.empleados import Empleado
from models.medicamentos import Medicamento


def resumen():
    return jsonify({
        "medicamentos": Medicamento.query.count(),
        "categorias": Categoria.query.count(),
        "empleados": Empleado.query.count(),
    }), 200
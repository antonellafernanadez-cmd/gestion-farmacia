from flask import Blueprint

from controllers import empleado_controller as c

bp = Blueprint("empleados", __name__, url_prefix="/api/empleados")

bp.add_url_rule("", "listar", c.listar, methods=["GET"])
bp.add_url_rule("/<int:id>", "obtener", c.obtener, methods=["GET"])
bp.add_url_rule("", "crear", c.crear, methods=["POST"])
bp.add_url_rule("/<int:id>", "modificar", c.modificar, methods=["PUT"])
bp.add_url_rule("/<int:id>", "eliminar", c.eliminar, methods=["DELETE"])
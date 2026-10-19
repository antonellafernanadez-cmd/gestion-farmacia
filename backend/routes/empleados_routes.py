from flask import Blueprint

from controllers import empleado_controller as c
from utils.decorators import admin_required

bp = Blueprint("empleados", __name__, url_prefix="/api/empleados")

# Solo el rol admin: sin sesión responden 401, con otro rol responden 403.
bp.add_url_rule("", "listar", admin_required(c.listar), methods=["GET"])
bp.add_url_rule("/<int:id>", "obtener", admin_required(c.obtener), methods=["GET"])
bp.add_url_rule("", "crear", admin_required(c.crear), methods=["POST"])
bp.add_url_rule("/<int:id>", "modificar", admin_required(c.modificar), methods=["PUT"])
bp.add_url_rule("/<int:id>", "eliminar", admin_required(c.eliminar), methods=["DELETE"])

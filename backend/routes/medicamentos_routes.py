from flask import Blueprint

from controllers import medicamento_controller as c
from utils.decorators import login_required

bp = Blueprint("medicamentos", __name__, url_prefix="/api/medicamentos")

# Todas las rutas exigen sesión iniciada: sin sesión responden 401.
bp.add_url_rule("", "listar", login_required(c.listar), methods=["GET"])
bp.add_url_rule("/<int:id>", "obtener", login_required(c.obtener), methods=["GET"])
bp.add_url_rule("", "crear", login_required(c.crear), methods=["POST"])
bp.add_url_rule("/<int:id>", "modificar", login_required(c.modificar), methods=["PUT"])
bp.add_url_rule("/<int:id>", "eliminar", login_required(c.eliminar), methods=["DELETE"])

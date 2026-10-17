from flask import Blueprint

from controllers import dashboard_controller as c
from utils.decorators import login_required

bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")

# Todas las rutas exigen sesión iniciada: sin sesión responden 401.
bp.add_url_rule("", "resumen", login_required(c.resumen), methods=["GET"])

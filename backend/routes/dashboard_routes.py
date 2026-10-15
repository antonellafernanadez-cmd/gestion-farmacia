from flask import Blueprint

from controllers import dashboard_controller as c

bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")

bp.add_url_rule("", "resumen", c.resumen, methods=["GET"])
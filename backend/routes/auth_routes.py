from flask import Blueprint

from controllers import auth_controller as c
from utils.decorators import login_required

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

bp.add_url_rule("/login", "login", c.login, methods=["POST"])
bp.add_url_rule("/logout", "logout", c.logout, methods=["POST"])
bp.add_url_rule("/me", "me", login_required(c.me), methods=["GET"])
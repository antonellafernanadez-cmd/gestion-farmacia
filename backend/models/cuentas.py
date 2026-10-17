from werkzeug.security import check_password_hash, generate_password_hash

from models.db import db

ROLES = ("admin", "empleado")


class Cuenta(db.Model):
    __tablename__ = "cuentas"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.String(20), nullable=False)

    def __init__(self, email, password, rol):
        if rol not in ROLES:
            raise ValueError("Rol inválido")
        self.email = email.strip().lower()
        self.rol = rol
        self.set_password(password)

    def set_password(self, password):
        # Nunca se guarda la contraseña en texto plano: solo su hash
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        # nunca se devuelve password_hash
        return {"id": self.id, "email": self.email, "rol": self.rol}
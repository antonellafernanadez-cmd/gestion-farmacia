from models.db import db


class Empleado(db.Model):
    __tablename__ = "empleados"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    dni = db.Column(db.String(10), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    cargo = db.Column(db.String(50), nullable=False)
    domicilio = db.Column(db.String(100))

    def __init__(self, nombre, apellido, dni, email, cargo, domicilio=None):
        self.nombre = nombre
        self.apellido = apellido
        self.dni = dni
        self.email = email
        self.cargo = cargo
        self.domicilio = domicilio

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "dni": self.dni,
            "email": self.email,
            "cargo": self.cargo,
            "domicilio": self.domicilio,
        }

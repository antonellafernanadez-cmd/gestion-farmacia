from models.db import db


class Medicamento(db.Model):
    __tablename__ = "medicamentos"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    laboratorio = db.Column(db.String(100))
    precio = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    fecha_vencimiento = db.Column(db.Date)

    # Clave foránea: cada medicamento pertenece a una categoría
    categoria_id = db.Column(
        db.Integer, db.ForeignKey("categorias.id"), nullable=False
    )
    categoria = db.relationship("Categoria", back_populates="medicamentos")

    def __init__(self, nombre, laboratorio, precio, stock, categoria_id,
                 fecha_vencimiento=None):
        self.nombre = nombre
        self.laboratorio = laboratorio
        self.precio = precio
        self.stock = stock
        self.categoria_id = categoria_id
        self.fecha_vencimiento = fecha_vencimiento

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "laboratorio": self.laboratorio,
            "precio": float(self.precio),
            "stock": self.stock,
            "fecha_vencimiento": (
                self.fecha_vencimiento.isoformat()
                if self.fecha_vencimiento else None
            ),
            "categoria_id": self.categoria_id,
            "categoria": self.categoria.nombre if self.categoria else None,
        }

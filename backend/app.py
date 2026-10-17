import os
from flask import Flask
from flask_cors import CORS
from config.config import DATABASE_CONNECTION_URI
from models.db import db
from routes.categorias_routes import bp as categorias_bp
from routes.medicamentos_routes import bp as medicamentos_bp
from routes.empleados_routes import bp as empleados_bp
from routes.dashboard_routes import bp as dashboard_bp
from routes.auth_routes import bp as auth_bp


app = Flask(__name__)


CORS(app, supports_credentials=True,
     origins=["http://localhost:5173", "http://127.0.0.1:5173"])

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_CONNECTION_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "clave-solo-para-desarrollo")

db.init_app(app)


app.register_blueprint(categorias_bp)
app.register_blueprint(medicamentos_bp)
app.register_blueprint(empleados_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(auth_bp)


with app.app_context():
    from models.categorias import Categoria
    from models.empleados import Empleado
    from models.medicamentos import Medicamento
    from models.cuentas import Cuenta

    db.create_all()


if __name__ == "__main__":
    app.run(debug=True)
from flask import Flask
from flask_cors import CORS
from config.config import DATABASE_CONNECTION_URI
from models.db import db
from routes.categorias_routes import bp as categorias_bp


app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_CONNECTION_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


app.register_blueprint(categorias_bp)


with app.app_context():
    from models.categorias import Categoria
    from models.empleados import Empleado
    from models.medicamentos import Medicamento

    db.create_all()


if __name__ == "__main__":
    app.run(debug=True)
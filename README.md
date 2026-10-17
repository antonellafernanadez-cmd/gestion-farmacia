# ValkiFarm

Sistema para gestionar una farmacia. Trabajo práctico de Programación II (IES 9-023).

## Integrantes

- COMPLETAR: nombre y apellido
- COMPLETAR: nombre y apellido

## Descripción

ValkiFarm es una aplicación web para administrar los medicamentos, las categorías y los empleados de una farmacia. De cada uno se puede crear, ver, modificar y eliminar.

Tiene un dashboard que muestra cuántos medicamentos, categorías y empleados hay, y los medicamentos con poco stock o próximos a vencer. También tiene un login con dos roles: el admin puede entrar a todo, y el empleado no puede entrar a la sección Empleados.

El frontend (React) le pide los datos al backend (Flask), y el backend los guarda en MySQL.

## Tecnologías utilizadas

- Backend: Python, Flask, Flask-SQLAlchemy, PyMySQL y Flask-Cors
- Base de datos: MySQL
- Frontend: React, Vite, Material UI, Axios y React Router
- Control de versiones: Git y GitHub

## Requisitos

- Python 3.10 o superior
- Node.js 18 o superior
- MySQL 8
- Git

## Instalación de dependencias

Clonar el repositorio:

```
git clone https://github.com/antonellafernanadez-cmd/gestion-farmacia.git
cd gestion-farmacia
```

Backend:

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

En Mac o Linux, el tercer comando es `source venv/bin/activate`.

Frontend (desde la carpeta principal del proyecto):

```
cd frontend
npm install
```

## Configuración de MySQL

El archivo `database/farmacia_db.sql` crea la base `gestion_farmacia` con sus tablas y los datos de prueba: 10 medicamentos, 5 categorías, 5 empleados y 2 usuarios.

Ojo: el script borra la base `gestion_farmacia` si ya existe y la vuelve a crear.

Para ejecutarlo, desde la carpeta principal del proyecto:

```
mysql -u root -p < database/farmacia_db.sql
```

También se puede abrir en MySQL Workbench y ejecutarlo desde ahí.

Las tablas son:

- `categorias`: id, nombre y descripcion.
- `medicamentos`: id, nombre, laboratorio, precio, stock, fecha_vencimiento y categoria_id.
- `empleados`: id, nombre, apellido, dni, email, cargo y domicilio.
- `cuentas`: id, email, password_hash y rol. Son los usuarios del login.

Todas tienen el `id` como clave primaria. La única clave foránea es `medicamentos.categoria_id`, que apunta a `categorias.id`: una categoría tiene muchos medicamentos, y no se puede borrar una categoría que todavía tenga medicamentos.

## Configuración del backend

Dentro de la carpeta `backend`, copiar el archivo `.env.example` con el nombre `.env`:

```
copy .env.example .env
```

En Mac o Linux: `cp .env.example .env`.

Después abrir el `.env` y completar los datos de tu MySQL (usuario, contraseña, host y puerto). El nombre de la base tiene que ser `gestion_farmacia`. En `SECRET_KEY` se puede poner cualquier texto largo. El `.env` no se sube a GitHub.

## Configuración del frontend

Si el backend corre en `http://localhost:5000`, no hace falta configurar nada. Si usa otra dirección, copiar `frontend/.env.example` como `frontend/.env` y cambiar `VITE_API_URL`.

## Cómo ejecutar el proyecto

Con MySQL encendido, hay que abrir dos terminales.

Terminal 1, el backend (queda en `http://localhost:5000`):

```
cd backend
venv\Scripts\activate
python app.py
```

Terminal 2, el frontend (queda en `http://localhost:5173`):

```
cd frontend
npm run dev
```

Después abrir `http://localhost:5173` en el navegador e iniciar sesión.

Usuarios de prueba:

- Admin: `admin@farmacia.com` / contraseña: COMPLETAR
- Empleado: `empleado@farmacia.com` / contraseña: COMPLETAR

Las contraseñas se guardan encriptadas (hash) en la base. Al iniciar sesión, Flask guarda la sesión en una cookie. Las rutas de la API están protegidas en el backend: si no hay sesión responden error 401, y si el usuario es empleado e intenta usar las rutas de empleados responden error 403.

## Estructura del proyecto

```
gestion-farmacia/
├── README.md
├── database/
│   └── farmacia_db.sql
├── backend/
│   ├── app.py
│   ├── config/         conexión a MySQL
│   ├── models/         tablas
│   ├── controllers/    lógica y validaciones
│   ├── routes/         rutas de la API
│   ├── utils/          login y mensajes de error
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── package.json
    └── src/
        ├── api/        pedidos al backend con Axios
        ├── components/ menú, logo y piezas que se repiten
        ├── context/    sesión y avisos
        ├── pages/      una carpeta por pantalla
        └── utils/
```

Rutas de la API. Medicamentos (`/api/medicamentos`), categorías (`/api/categorias`) y empleados (`/api/empleados`) tienen las mismas cinco:

- `GET /api/recurso`: lista todos
- `GET /api/recurso/<id>`: trae uno
- `POST /api/recurso`: crea
- `PUT /api/recurso/<id>`: modifica
- `DELETE /api/recurso/<id>`: elimina

Además existen `GET /api/dashboard` y las rutas de login: `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`. Todas piden sesión, menos el login, y las de empleados son solo para el admin.

Validaciones principales:

- Medicamentos: nombre obligatorio, precio mayor a 0, stock que no sea negativo, categoría obligatoria y fecha válida.
- Categorías: nombre obligatorio y no se puede repetir.
- Empleados: nombre, apellido, DNI y cargo obligatorios, email válido, y DNI y email no repetidos.



## Integrantes y distribución de tareas

- COMPLETAR (nombre): COMPLETAR (por ejemplo: base del frontend, pantallas de Categorías y Empleados, diseño)
- COMPLETAR (nombre): COMPLETAR (por ejemplo: Dashboard, pantalla de Medicamentos, base de datos)

Las dos conocemos y podemos explicar cómo funciona todo el sistema.

## Cómo trabajamos con Git

Usamos la rama `main` para la entrega final, `develop` para juntar el trabajo y una rama `feature/...` para cada parte (por ejemplo `feature/empleados`). Cada una trabajó en su rama, hizo commits con mensajes descriptivos y abrió un Pull Request hacia `develop`. Al final, `develop` se pasó a `main` con un merge común.

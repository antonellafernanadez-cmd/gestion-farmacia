DROP DATABASE IF EXISTS gestion_farmacia;
CREATE DATABASE gestion_farmacia
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_farmacia;


CREATE TABLE categorias (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL UNIQUE,
  descripcion VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE medicamentos (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  nombre            VARCHAR(100) NOT NULL,
  laboratorio       VARCHAR(100),
  precio            DECIMAL(10,2) NOT NULL,
  stock             INT NOT NULL DEFAULT 0,
  fecha_vencimiento DATE,
  categoria_id      INT NOT NULL,
  CONSTRAINT fk_medicamento_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB;

CREATE TABLE empleados (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(50)  NOT NULL,
  apellido  VARCHAR(50)  NOT NULL,
  dni       VARCHAR(10)  NOT NULL UNIQUE,
  email     VARCHAR(120) NOT NULL UNIQUE,
  cargo     VARCHAR(50)  NOT NULL,
  domicilio VARCHAR(100)
) ENGINE=InnoDB;

CREATE TABLE cuentas (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol           VARCHAR(20)  NOT NULL
) ENGINE=InnoDB;

INSERT INTO categorias (nombre, descripcion) VALUES
  ('Analgesicos',   'Alivia el dolor (cabeza, muscular, dental o menstrual) y algunos como el Paracetamol ayudan a reducir la fiebre'),
  ('Antibioticos',  'Tratan infecciones causadas por bacterias'),
  ('Antialergicos', 'Control de síntomas de alergias'),
  ('Digestivos',    'Problemas estomacales e intestinales'),
  ('Vitaminas',     'Complementos nutricionales');

INSERT INTO medicamentos
  (nombre, laboratorio, precio, stock, fecha_vencimiento, categoria_id) VALUES
  ('Ibuprofeno 400 mg',   'Bayer',      3500.00, 60,  '2027-08-15', 1),
  ('Paracetamol 500 mg',  'Genéricos',  2200.50, 120, '2027-03-10', 1),
  ('Aspirina 500 mg',     'Bayer',      2900.00, 8,   '2026-11-05', 1),
  ('Amoxicilina 500 mg',  'Roemmers',   6800.00, 35,  '2027-01-20', 2),
  ('Azitromicina 500 mg', 'Pfizer',     9500.00, 5,   '2026-12-01', 2),
  ('Loratadina 10 mg',    'Bago',       3100.00, 45,  '2027-06-30', 3),
  ('Cetirizina 10 mg',    'Roemmers',   3400.00, 40,  '2027-09-12', 3),
  ('Omeprazol 20 mg',     'Gador',      4100.00, 70,  '2027-05-18', 4),
  ('Buscapina Compuesta', 'Boehringer', 5200.00, 9,   '2026-10-30', 4),
  ('Vitamina C 1 g',      'Bago',       3800.00, 90,  '2028-02-01', 5);

INSERT INTO empleados (nombre, apellido, dni, email, cargo, domicilio) VALUES
  ('Laura',   'Fernandez',     '23840942', 'laura.fernandez@farmacia.com',     'Farmacéutica',   'Rodeo del medio, Maipu'),
  ('Martin',  'Rodriguez', '30234567', 'martin.rodriguez@farmacia.com','Encargado',      'Belgrano 456, Maipu'),
  ('Sofia',   'Gomez', '35345678', 'sofia.gomez@farmacia.com', 'Vendedora',      'Italia 789, Godoy Cruz'),
  ('Diego',   'Perez',     '33456789', 'diego.perez@farmacia.com',     'Cadete',         'Mitre 321, Luján de Cuyo'),
  ('Valeria', 'Sosa',      '31567890', 'valeria.sosa@farmacia.com',    'Administrativa', 'Peru 654, Maipu');

INSERT INTO cuentas (email, password_hash, rol) VALUES
  ('admin@farmacia.com',    'scrypt:32768:8:1$Lg1haqX1h3Ql0dsh$1d1768ba9b933e7ae3d70b5e29cf4f6cfebcea601136ce984f98e94a3c75b777e5db5aa2c9cf51155950027a0d9eb9d63ad6caf2cd3c868d580dcebfc6187ea1', 'admin'),
  ('empleado@farmacia.com', 'scrypt:32768:8:1$XX9aXMK0pAyxaQuu$7a88d7085cdc321425b802c9b0fe096b6e119732c5d7faf771c36324455f0219844e48001ab6604953dc92380411ccedd5750c46deae8c9a1c0e321b21c2113b', 'empleado');
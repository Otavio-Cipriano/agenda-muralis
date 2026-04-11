CREATE DATABASE agenda;

USE agenda;

CREATE TABLE cliente (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  data_nascimento DATE,
  endereco varchar(255)
);

CREATE TABLE contato (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  cliente_id BIGINT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  valor VARCHAR(100) NOT NULL,
  observacao VARCHAR(255),
  FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
);

CREATE DATABASE agenda;

USE agenda;

CREATE TABLE cliente (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  data_nascimento DATE,
  endereco_id BIGINT NOT NULL,
  FOREIGN KEY (endereco_id) REFERENCES endereco(id)
);

CREATE TABLE contato (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  cliente_id BIGINT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  valor VARCHAR(100) NOT NULL,
  observacao VARCHAR(255),
  FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
);

CREATE TABLE endereco(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    cep VARCHAR(10) NOT NULL
)
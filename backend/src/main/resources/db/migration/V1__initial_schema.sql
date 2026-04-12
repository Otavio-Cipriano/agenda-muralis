CREATE TABLE clientes
(
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome            VARCHAR(100) NOT NULL,
    cpf             VARCHAR(14)  NOT NULL UNIQUE,
    data_nascimento DATE,
    endereco        varchar(255)
);

CREATE TABLE contatos
(
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    clientes_id BIGINT       NOT NULL,
    tipo       VARCHAR(50)  NOT NULL,
    valor      VARCHAR(100) NOT NULL,
    observacao VARCHAR(255),
    FOREIGN KEY (clientes_id) REFERENCES clientes (id) ON DELETE CASCADE
);
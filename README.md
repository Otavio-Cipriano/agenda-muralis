# Agenda 

## Estrutura do Projeto

### Arquitetura do Projeto

Este projeto segue uma arquitetura em camadas no backend (Spring Boot) e uma estrutura simples no frontend.

### Backend (Java + Spring Boot)

A estrutura do backend foi organizada para separar responsabilidades, conforme solicitado pelo desafio

* **`controller/`**
  Responsável por expor os endpoints da API. Recebe as requisições HTTP e retorna as respostas.
  Ex: `ClienteController`, `ContatoController`

* **`service/`**
  Contém a lógica de negócio.

* **`repository/`**
  Camada de acesso ao banco de dados. Utiliza interfaces do Spring Data JPA.

* **`model/`**
  Representa as entidades do sistema (tabelas do banco de dados).
  Ex: `Cliente`, `Contato`

* **`dto/` (Data Transfer Object)**
  Usado para transferência de dados entre camadas, evitando expor diretamente as entidades.

  * `request/`: dados recebidos da API
  * `response/`: dados retornados ao cliente

* **`config/`**
  Configurações da aplicação (ex: CORS).

* **`handler/`**
  Tratamento global de exceções da aplicação.

* **`enums/`**
  Enumerações utilizadas no sistema (ex: tipos fixos como `TipoContato`).

* **`resources/`**
  Arquivos de configuração e scripts do banco:

  * `application.properties`: configurações da aplicação
  * `db/migration/`: scripts de versionamento do banco (Flyway)

---

### 🌐 Frontend (HTML, CSS, JS)

O frontend é simples e separado do backend:

* **`index.html`**
  Estrutura principal da aplicação

* **`css/`**
  Estilos da aplicação

* **`js/`**
  Lógica do frontend e consumo da API

---


### File Tree
```bash
backend/
  pom.xml
  mvnw
  mvnw.cmd
  src/
    main/
      java/com/agenda/agenda_api/
        AgendaApiApplication.java
        config/
          CorsConfig.java
        controller/
          ClienteController.java
          ContatoController.java
        dto/
          request/
            ClienteRequest.java
            ClienteResumoRequest.java
            ContatoRequest.java
          response/
            ClienteResponse.java
            ClienteResumoResponse.java
            ContatoResponse.java
        enums/
          TipoContato.java
        handler/
          GlobalExceptionHandler.java
        model/
          Cliente.java
          Contato.java
        repository/
          ClienteRepository.java
          ContatoRepository.java
        service/
          ClienteService.java
          ContatoService.java
      resources/
        application.properties
        db/migration/
          V1__initial_schema.sql
          V202604121513__add_audit_fields.sql
    test/
      java/com/agenda/agenda_api/
        AgendaApiApplicationTests.java
frontend/
  index.html
  css/
    style.css
  js/
    main.js
package.json
README.md
```

## Tecnologias Utilizadas

### Backend

* **Java 21**
* **Spring Boot**
  * Spring Web MVC (criação de APIs REST)
  * Spring Data JPA (persistência de dados)
  * Spring Validation (validação de dados)
* **Flyway** (versionamento de banco de dados)
* **MySQL** (banco de dados relacional)
* **Lombok** (redução de código boilerplate) //Embora esteja no projeto acabei não usando, mas vou listar mesmo assim
* **Springdoc OpenAPI (Swagger)** (documentação da API)
* **Maven** (gerenciamento de dependências e build)

### 🌐 Frontend

* **HTML5**
* **CSS3**
* **JavaScript**
* **Bootstrap** (framework de estilização)


## Dependências


- **spring-boot-starter-webmvc** → cria APIs REST
- **spring-boot-starter-data-jpa** → acesso ao banco
- **spring-boot-starter-validation** → validação de DTOs
- **flyway-mysql** → migração do banco
- **mysql-connector-j** → conexão com MySQL
- **lombok** → reduz código repetitivo
- **springdoc-openapi** → Swagger (documentação da API)

## Inicialização do Projeto

O backend foi gerado utilizando o [Spring Initializr](https://start.spring.io/), ferramenta oficial para criação de projetos Spring Boot com configuração inicial de dependências.

A partir dele foram adicionadas e configuradas manualmente as dependências e estrutura do projeto.

## Features
### Back-end
- [x] Listar Clientes
- [x] Criar Cliente
- [x] Editar Cliente
- [x] Deletar Cliente
- [x] Listar Contatos de Cliente
- [x] Adicionar Contato ao Cliente
- [x] Editar Contato do Cliente
- [x] Deletar Contato do cliente
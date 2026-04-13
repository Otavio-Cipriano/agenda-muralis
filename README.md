# Agenda 

## FluxoGrama

![fluxograma do projeto](/entregaveis/Fluxograma.png)

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

### Foi criado com:

O backend foi gerado utilizando o [Spring Initializr](https://start.spring.io/), ferramenta oficial para criação de projetos Spring Boot com configuração inicial de dependências.

A partir dele foram adicionadas e configuradas manualmente as dependências e estrutura do projeto.

### Pré-requisitos

Antes de rodar o projeto, você precisa ter instalado:

- ☕ **Java 21 ou Superior**
- 🧰 **Maven (instalado globalmente)**
- 🐬 **MySQL Server**
- 🖥️ (Opcional) IDE como IntelliJ IDEA ou VS Code

---

## Configuração do banco de dados

Crie um banco no MySQL:

```sql
CREATE DATABASE agenda;
```

Depois configure o arquivo:
```text
src/main/resources/application.properties
```

Exemplo:
```text
spring.application.name=agenda_api

# Banco de dados
spring.datasource.url=jdbc:mysql://localhost:3306/agenda?createDatabaseIfNotExist=true
spring.datasource.username=user
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=none
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.open-in-view=false

# Flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true

# Hikari
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=3
spring.datasource.hikari.idle-timeout=10000

springdoc.default-flat-param-object=true
```
## Como Rodar

### Backend

```Bash
mvn spring-boot:run
```
#### Documentação da API (Swagger)

Após rodar o projeto, acesse:

```
http://localhost:8080/swagger-ui/index.html
```

### Frontend

O frontend é **estático**, desenvolvido apenas com HTML, CSS e JavaScript puro.

Não utiliza frameworks ou ferramentas de build.

#### Estrutura do Frontend:

```text
frontend/
   index.html
   css/
     style.css
  js/
    main.js
```

### Como usar o frontend

O frontend é estático (HTML, CSS e JavaScript puro), portanto não requer instalação de dependências.

### Passos:
1. Acesse a pasta `/frontend`
2. Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Edge)
3. Certifique-se de que o backend esteja rodando para que a API funcione corretamente

### ⚠️ Importante
O frontend depende do backend Spring Boot rodando localmente para consumir os dados da API.

### Funcionamento

- O `index.html` é o ponto de entrada da aplicação
- O `style.css` contém os estilos visuais
- O `main.js` contém a lógica e consumo da API backend

A comunicação com o backend é feita via requisições HTTP (fetch).

## Referencias

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/documentation.html)
- [Desafios Vagas: API de tarefas com Spring boot](https://www.youtube.com/watch?v=IjProDV001o&t=6s)
- [Using Spring Boot with FLyway](https://medium.com/@AlexanderObregon/using-spring-boot-with-flyway-to-manage-database-migrations-8180ce0c9230)
- [Flyway Documentation](https://documentation.red-gate.com/flyway/getting-started-with-flyway/quickstart-guides/quickstart-maven)
- [Maven Documentation](https://maven.apache.org/)


## Uso de IA

Utilizei ferramentas de Inteligência Artificial como apoio durante o desenvolvimento, principalmente para entender melhor o uso de beans e injeção de dependência no Spring Boot, ajustando a estrutura para separar regras de negócio do service e aplicar corretamente o uso de DTOs. Também utilizei IA com mais frequência no frontend para acelerar a implementação após finalizar o backend, devido a limitação de tempo.

## Features
### Back-end
- [x] Listar Clientes
  - [x] Paginação 
- [x] Criar Cliente
  - [x] Validação
- [x] Editar Cliente
  - [x] Checar se cliente existe
  - [x] Validação
- [x] Deletar Cliente
  - [x] Checar se cliente existe
- [x] Listar Contatos de Cliente
- [x] Adicionar Contato ao Cliente
- [x] Editar Contato do Cliente
- [x] Deletar Contato do cliente
- [x] Busca de Cliente

### Front-end
- [x] Lista de Clientes
- [x] Busca de Clientes
- [x] Modal pra criar clientes
  - [x] Validação no modal de criar clientes
  - [x] Botão para adicionar contato dinamicamente
  - [x] Remover contato dinamicamente
  - [x] Modal para confirmar exclusão de contato
  - [x]
- [x] Modal para detalhar Cliente
  - [x] Botão para editar cliente em detalhar

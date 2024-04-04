# API do projeto Health Log - v3

Versão v3 do protótipo da API do projeto Health Log, sendo desenvolvida com o
objetivo de aplicar de forma apropriada a metodologia de desenvolvimento TDD,
tentar escrever testes mais concisos e testar diferentes estruturas/arquiteturas
para o projeto.

## Pré-requisitos

- Ter o Docker instalado

## Metodologias

- TDD (Test-Driven Development)

## Tecnologias Utilizadas

### API

- Express.js
- Typescript

### Banco de dados

- PostgreSQL
- Knex.js

### Testes

- Jest
- SuperTest

## Funcionalidades Implementadas

- Cadastro de usuário
- ...

## Como Executar

1. Clone este repositório.
2. Instale as dependências do projeto:

```bash
  npm install
  # ou
  yarn install
```

3. Execute o comando para criar o container com o PostgreSQL:

```bash
  npm run db-setup:init
  #ou
  yarn db-setup:init
```

4. Inicie o servidor:

```bash
  npm run dev
  # ou
  yarn dev
```

5. Acesse a API através do endereço: `http://localhost:3000`.
6. (Opcional) Execute os testes do projeto:

```bash
  npm run test
  # ou
  yarn test
```

## Removendo o Container

1. Para remover apenas o container, execute:

```bash
  npm run setup-db:rm
  # ou
  yarn setup-db:rm
```

2. Para remover o container e o volume do banco de dados, execute:

```bash
  npm run setup-db:rmv
  # ou
  yarn setup-db:rmv
```

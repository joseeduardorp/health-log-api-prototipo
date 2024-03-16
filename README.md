# API do projeto Health Log

Versão protótipo da API do projeto Health Log, para avaliar a escolha das tecnologias escolhidas.

## Pré-requisitos

- Ter o Docker instalado

## Tecnologias Utilizadas

### API

- Express.js
- Typescript

### Banco de dados

- PostgreSQL

### Testes

- Jest
- SuperTest

## Funcionalidades Implementadas

- Cadastro de usuários.
- ...

## Como Executar

1. Clone este repositório.
2. Instale as dependências do projeto:

```bash
  npm install
```

3. Crie um container no Docker com a imagem do PostgreSQL:

```bash
  docker run --name {nome_do_container} -e POSTGRES_PASSWORD={sua_senha} -p 5432:5432 -d postgres
  docker start {nome_do_container}
```

4. Inicie o servidor:

```bash
  npm run dev
```

5. Acesse a API através do endereço: `http://localhost:3000`.
6. (Opcional) Execute os testes do projeto:

```bash
  npm run test
```

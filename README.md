# API do projeto Health Log - [Descontinuado]

Versão protótipo da API do projeto Health Log, sendo desenvolvida com o objetivo
de avaliar as tecnologias escolhidas e verificar a necessidade de uso outras
ferramentas/tecnologias.

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

- Cadastro de pacientes e cuidadores.
- Acessar conta do usuário.

## Como Executar

1. Clone este repositório.
2. Instale as dependências do projeto:

```bash
  npm install
```

3. Execute o Docker Compose para configurar o container do PostgreSQL:

```bash
  docker compose up -d
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

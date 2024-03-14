# criar container:

docker run --name cdr-postgres -e POSTGRES_PASSWORD=remedios -p 5432:5432 -d postgres

# entrar no container

docker exec -ti 2459ac8f63b5 /bin/bash

# entrar na conta padrão

psql --username=postgres

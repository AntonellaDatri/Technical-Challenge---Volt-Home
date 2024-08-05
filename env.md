Crear un .env en el root del proyecto con los siguientes valores:

```
PORT=8080
# ponerlo en PROD al correrlo usando npm run docker:deploy
# ponerlo en DEV al correrlo usando npm run dev
NODE_ENV=PROD

# DB
# en caso de correrlo en DEV asegurarse de que no hay una DB de postgresql corriendo localmente o cambiarlo por puerto 5433
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=root

# DOCKER
POSTGRES_USER=root
POSTGRES_PASSWORD=root
POSTGRES_DB=crypto_saving

# API
CRYPTOCOMPARE_API_URL=https://min-api.cryptocompare.com/data/price
```
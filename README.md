## About

#### Building (On windows)

1. <a href="https://browsehappy.com/" target="_blank">Install a modern browser(Firefox/Chrome).</a>
2. <a href="http://git-scm.com/download/win" target="_blank">Install Git.</a>
3. <a href="https://nodejs.org/en/" target="_blank">Install Node.js.</a>
4. <a href="https://www.postgresql.org/download/windows/" target="_blank">Install PostgreSQL.</a>
5. <a href="https://winnie.postgis.net/download/windows/" target="_blank">Install PostGIS.</a>
6. In the command line terminal, Clone the Streetmix repository to your computer.
```
git clone https://github.com/streetmix/streetmix.git
```
7. Change the directory to Streetmix’s root directory, and install project dependencies.
```
cd streetmix
npm install
```
8. Initialize the PostgreSQL database.(Need to setting environment variable of database first.)
```
npx sequelize db:create
npx sequelize db:migrate
```

#### Environment Variable

First, create .env file.
You can copy .env.example to .env.
Then, Setting
```
# Auth0 part, applied by auth0.com
AUTH0_DOMAIN=dev-pwcu5v2o.us.auth0.com
AUTH0_CLIENT_ID=lY5SMuhzPU9ckHrTCJYjQ4pyWGO0FsfP
AUTH0_CLIENT_SECRET=VtQqh1UDgJ1mWTZvOE52FMb8Qrvg0b7w61VZ1aCH8dYcq4IhKF64ygpRCJuGBN4w
```
```
# Database part
PGUSER=postgres # Your database username, postgres by default.
PGPASSWORD=123456 # Your database password, setting on install postgreSQL.
PGDATABASE=streetmix_dev # Your database table, if empty, then streetmix_dev by default.
PGHOST=127.0.0.1 # Your host ip, if empty, then 127.0.0.1 by default.
PGPORT=5432 # Your database port,  if empty, then 5432 by default.
```

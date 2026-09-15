#!/bin/bash
# Usuário do app é DONO do database (DDL completo p/ migrations, sem superuser no app).
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
  CREATE USER "$APP_USER" WITH PASSWORD '$APP_PASSWORD';
  CREATE DATABASE "$APP_DB" OWNER "$APP_USER";
EOSQL

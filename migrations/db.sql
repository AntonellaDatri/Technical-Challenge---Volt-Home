CREATE EXTENSION IF NOT EXISTS dblink;

DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_database
      WHERE datname = 'crypto_saving'
   ) THEN
      PERFORM dblink_exec('dbname=' || current_database(), 'CREATE DATABASE crypto_saving');
   END IF;
END
$$;

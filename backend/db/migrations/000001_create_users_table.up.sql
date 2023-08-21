CREATE TABLE IF NOT EXISTS users(
   id SERIAL PRIMARY KEY,
   name VARCHAR (64) NOT NULL,
   email VARCHAR (64) NOT NULL,
   password VARCHAR (64),
   status VARCHAR (16) NOT NULL DEFAULT 'Enabled',
   source VARCHAR (16) NOT NULL,
   created_at TIMESTAMPTZ NOT NULL,
   created_by VARCHAR (32) NOT NULL,
   updated_at TIMESTAMPTZ,
   updated_by VARCHAR (32)
);
CREATE TABLE IF NOT EXISTS problems(
   id SERIAL PRIMARY KEY,
   name VARCHAR (64) NOT NULL,
   description TEXT,
   created_at TIMESTAMPTZ NOT NULL
   created_by VARCHAR (32) NOT NULL,
   updated_at TIMESTAMPTZ
   updated_by VARCHAR (32)
);
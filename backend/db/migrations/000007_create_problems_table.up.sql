ALTER TABLE problems ALTER COLUMN created_by TYPE integer USING created_by::integer;
ALTER TABLE problems ALTER COLUMN updated_by TYPE integer USING updated_by::integer;
ALTER TABLE problems ADD CONSTRAINT problems_created_by FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE problems ADD CONSTRAINT problems_updated_by FOREIGN KEY (updated_by) REFERENCES users(id);
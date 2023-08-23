ALTER TABLE problems ALTER COLUMN created_by TYPE VARCHAR (32);
ALTER TABLE problems ALTER COLUMN updated_by TYPE VARCHAR (32);
ALTER TABLE problems DROP CONSTRAINT problems_created_by;
ALTER TABLE problems DROP CONSTRAINT problems_updated_by;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
INSERT INTO users (name, email, password, status, source) VALUES ('per_cherry', 'per_cherry@163.com', md5('problem_resolver'), 'Enabled', 'Password');
CREATE TABLE IF NOT EXISTS problem_answers (
    id SERIAL PRIMARY KEY,
    problem_id integer NOT NULL REFERENCES problems(id),
    answer TEXT NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'enabled',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by integer NOT NULL,
    updated_at TIMESTAMPTZ,
    updated_by integer,
    CONSTRAINT problem_answers_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT problem_answers_updated_by FOREIGN KEY (updated_by) REFERENCES users(id)
);
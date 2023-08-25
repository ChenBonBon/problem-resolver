CREATE TABLE IF NOT EXISTS user_problems (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    problem_id INTEGER NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'unsolved',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    UNIQUE (user_id, problem_id),
    CONSTRAINT user_problems_user_id FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT user_problems_problem_id FOREIGN KEY (problem_id) REFERENCES problems(id)
);
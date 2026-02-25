CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  status_task VARCHAR(30) NOT NULL,
  priority_task VARCHAR(30) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deadline TIMESTAMP NOT NULL,

  user_id INTEGER DEFAULT 1,

  CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

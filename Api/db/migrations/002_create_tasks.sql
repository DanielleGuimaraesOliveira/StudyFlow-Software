CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,

  titulo VARCHAR(100) NOT NULL,
  descricao VARCHAR(500),

  status VARCHAR(30) NOT NULL,
  prioridade VARCHAR(30) NOT NULL,

  data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
  data_final TIMESTAMP NOT NULL,

  user_id INTEGER NOT NULL,

  CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

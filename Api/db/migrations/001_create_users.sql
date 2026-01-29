CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_data_criacao ON users(data_criacao);

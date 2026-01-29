import 'dotenv/config'
import { Pool } from 'pg'
import { UserRepository } from '../aplicacao/UserService.ts'
import { User } from '../dominio/userEntity.ts'
import { ErroInfra } from '../../../Shared/erros/erros.ts'

interface UserRows {
  id: number
  nome: string
  senha: string
  email: string
  data_criacao: Date
}

export class UserRepositoryPg implements UserRepository {
  private pool: Pool
  constructor() {
    this.pool = new Pool({ connectionString: process.env['DATABASE_URL'] })
  }

  async criarUsuario(user: User): Promise<User> {
    try {
      const query = `INSERT INTO users (nome, email, senha, data_criacao)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nome, email, senha, data_criacao`

      const values = [user.getNome(), user.getEmail(), user.getSenha(), user.getDataCriacao()]

      const resultado = await this.pool.query(query, values)
      return this.toDomain(resultado.rows[0])
    } catch (error) {
      throw new ErroInfra('Erro ao criar um usuário')
    }
  }

  async atualizar(user: User): Promise<User | null> {
    try {
      const query = `UPDATE users 
            SET nome = $1, email = $2, senha = $3, 
            data_criacao = $4 WHERE id = $5
            RETURNING id, nome, email, senha, data_criacao`

      const values = [
        user.getNome(),
        user.getEmail(),
        user.getSenha(),
        user.getDataCriacao(),
        user.getId(),
      ]
      const result = await this.pool.query(query, values)
      if (result.rows.length == 0) {
        return null
      }
      return this.toDomain(result.rows[0])
    } catch (erro) {
      throw new ErroInfra('Erro ao atualizar o usuário')
    }
  }

  async buscarPorId(userId: number): Promise<User | null> {
    try {
      const query = `SELECT * FROM users WHERE id = $1`
      const resultado = await this.pool.query(query, [userId])
      return resultado.rows[0] ? this.toDomain(resultado.rows[0]) : null
    } catch (error) {
      throw new ErroInfra('Erro ao buscar o usuário por id')
    }
  }

  async deletar(userId: number): Promise<void> {
    try {
      const query = `DELETE FROM users WHERE id = $1`
      await this.pool.query(query, [userId])
    } catch (error) {
      throw new ErroInfra('Erro ao deletar o usuário')
    }
  }

  private toDomain(row: UserRows): User {
    if (!row) {
      throw new ErroInfra('O registro está em branco')
    }

    return User.fromDatabase({
      id: row.id,
      nome: row.nome,
      senha: row.senha,
      email: row.email,
      dataCriacao: row.data_criacao,
    })
  }
}

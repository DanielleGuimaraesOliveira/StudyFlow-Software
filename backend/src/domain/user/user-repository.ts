import 'dotenv/config'
import { pool } from '../../../database/pool.ts'
import { UserRepository } from '../../application/user/user-service.ts'
import { User } from '../../domain/user/user-entity.ts'
import { DataBaseError } from '../../shared/errors/errors.ts'

interface UserRows {
  id: number
  name: string
  password: string
  email: string
  created_on: Date
}

export class UserRepositoryPg implements UserRepository {
  constructor() {}

  async save(user: User): Promise<User> {
    try {
      const query = `INSERT INTO users (name, email, password, created_on)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, created_on`

      const values = [user.getName(), user.getEmail(), user.getPassword(), user.getCreatedAt()]

      const result = await pool.query(query, values)
      return this.toDomain(result.rows[0])
    } catch {
      throw new DataBaseError('Connection with database failed')
    }
  }

  async update(user: User): Promise<User | null> {
    try {
      const query = `UPDATE users 
            SET name = $1, email = $2, password = $3, 
            created_on = $4 WHERE id = $5
            RETURNING id, name, email, created_on`

      const values = [
        user.getName(),
        user.getEmail(),
        user.getPassword(),
        user.getCreatedAt(),
        user.getId(),
      ]
      const result = await pool.query(query, values)
      if (result.rows.length == 0) {
        return null
      }
      return this.toDomain(result.rows[0])
    } catch {
      throw new DataBaseError('Connection with database failed')
    }
  }

  async findById(userId: number): Promise<User | null> {
    try {
      const query = `SELECT * FROM users WHERE id = $1`
      const result = await pool.query(query, [userId])
      return result.rows[0] ? this.toDomain(result.rows[0]) : null
    } catch {
      throw new DataBaseError('Connection with database failed')
    }
  }

  async remove(userId: number): Promise<void> {
    try {
      const query = `DELETE FROM users WHERE id = $1`
      await pool.query(query, [userId])
    } catch {
      throw new DataBaseError('Connection with database failed')
    }
  }

  private toDomain(row: UserRows): User {
    if (!row) {
      throw new DataBaseError('O registro está em branco')
    }

    return User.fromDatabase({
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_on,
    })
  }
}

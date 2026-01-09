import 'dotenv/config'
import { Pool } from 'pg'
import { Task } from '../../../../Shared/Dominio/Task/task'
import { TaskPrioridade, TaskStatus } from '../../../../Shared/Dominio/Task/taskEnums'
import { TaskRepository } from './TaskService'

interface TaskRow {
  id: number
  titulo: string
  descricao: string | undefined
  status: string
  prioridade: string
  data_criacao: Date
  data_final: Date
}

export class TaskRepositoryPrisma implements TaskRepository {
  private pool: Pool

  constructor() {
    this.pool = new Pool({
      connectionString: process.env['DATABASE_URL'],
    })
  }

  async criar(task: Task): Promise<Task> {
    const query = `
      INSERT INTO tasks (titulo, descricao, status, prioridade, data_criacao, data_final)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `
    const values = [
      task.getTitulo(),
      task.getDescricao(),
      task.getTaskStatus(),
      task.getTaskPrioridade(),
      task.getDataCriacao(),
      task.getDataFinal(),
    ]

    const result = await this.pool.query(query, values)
    return this.toDomain(result.rows[0])
  }

  async buscarPorId(id: number): Promise<Task | null> {
    const query = 'SELECT * FROM tasks WHERE id = $1'
    const result = await this.pool.query(query, [id])
    return result.rows[0] ? this.toDomain(result.rows[0]) : null
  }

  async listarTodas(): Promise<Task[]> {
    const query = 'SELECT * FROM tasks ORDER BY id'
    const result = await this.pool.query(query)
    return result.rows.map((row) => this.toDomain(row))
  }

  async listarPorStatus(status: TaskStatus): Promise<Task[]> {
    const query = 'SELECT * FROM tasks WHERE status = $1 ORDER BY id'
    const result = await this.pool.query(query, [status])
    return result.rows.map((row) => this.toDomain(row))
  }

  async atualizar(task: Task): Promise<void> {
    const query = `
      UPDATE tasks 
      SET titulo = $1, descricao = $2, status = $3, prioridade = $4, 
          data_criacao = $5, data_final = $6
      WHERE id = $7
    `
    const values = [
      task.getTitulo(),
      task.getDescricao(),
      task.getTaskStatus(),
      task.getTaskPrioridade(),
      task.getDataCriacao(),
      task.getDataFinal(),
      task.getId(),
    ]
    await this.pool.query(query, values)
  }

  async deletar(id: number): Promise<void> {
    const query = 'DELETE FROM tasks WHERE id = $1'
    await this.pool.query(query, [id])
  }

  private toDomain(row: TaskRow): Task {
    return new Task({
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      taskStatus: row.status as TaskStatus,
      taskPrioridade: row.prioridade as TaskPrioridade,
      dataCriacao: row.data_criacao,
      dataFinal: row.data_final,
    })
  }
}

import 'dotenv/config'
import { pool } from '../../../database/pool'
import { Task } from '../task/task-entity'
import { TaskPriority, TaskStatus } from '../task/task-enums'
import { TaskRepository } from '../../application/task/task-service'
import { DataBaseError } from '../../shared/errors/errors'

interface TaskRow {
  id: number
  title: string
  description: string | undefined
  status_task: string
  priority_task: string
  created_at: Date
  deadline: Date
}

export class TaskRepositoryPg implements TaskRepository {
  constructor() {}

  async save(task: Task): Promise<Task> {
    try {
      const query = `
        INSERT INTO tasks (title, description, status_task, priority_task, created_at, deadline)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `
      const values = [
        task.getTitle(),
        task.getDescription(),
        task.getTaskStatus(),
        task.getTaskPriority(),
        task.getCreatedAt(),
        task.getDeadline(),
      ]

      const result = await pool.query(query, values)

      return this.toDomain(result.rows[0])
    } catch {
      throw new DataBaseError('Failed to save task in database')
    }
  }

  async findById(id: number): Promise<Task | null> {
    try {
      const query = 'SELECT * FROM tasks WHERE id = $1'
      const result = await pool.query(query, [id])
      return result.rows[0] ? this.toDomain(result.rows[0]) : null
    } catch {
      throw new DataBaseError('Failed to find task by id')
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      const query = 'SELECT * FROM tasks ORDER BY id'
      const result = await pool.query(query)
      return result.rows.map((row) => this.toDomain(row))
    } catch {
      throw new DataBaseError('Failed to find all tasks')
    }
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    try {
      const query = 'SELECT * FROM tasks WHERE status_task = $1 ORDER BY id'
      const result = await pool.query(query, [status])
      return result.rows.map((row) => this.toDomain(row))
    } catch {
      throw new DataBaseError('Failed to find task by status')
    }
  }

  async update(task: Task): Promise<Task> {
    try {
      const query = `
        UPDATE tasks 
        SET title = $1, description = $2, status_task = $3, priority_task = $4, 
            created_at = $5, deadline = $6
        WHERE id = $7
        RETURNING id, title, description, status_task, priority_task, created_at, deadline
      `
      const values = [
        task.getTitle(),
        task.getDescription(),
        task.getTaskStatus(),
        task.getTaskPriority(),
        task.getCreatedAt(),
        task.getDeadline(),
        task.getId(),
      ]
      const result = await pool.query(query, values)

      return this.toDomain(result.rows[0])
    } catch {
      throw new DataBaseError('Failed to update task in database')
    }
  }

  async deleteById(id: number): Promise<void> {
    try {
      const query = 'DELETE FROM tasks WHERE id = $1'
      await pool.query(query, [id])
    } catch {
      throw new DataBaseError('Failed to delete task by id')
    }
  }

  private toDomain(row: TaskRow): Task {
    return new Task({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status_task as TaskStatus,
      priority: row.priority_task as TaskPriority,
      createdAt: row.created_at,
      deadline: row.deadline,
    })
  }
}

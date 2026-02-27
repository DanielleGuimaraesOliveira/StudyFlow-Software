import { TaskStatus } from '../entities/task-enums'
import { Task } from './../entities/task-entity'

export interface TaskRepository {
  save(task: Task): Promise<Task>
  findById(id: number): Promise<Task | null>
  findAll(): Promise<Task[]>
  findByStatus(status: TaskStatus): Promise<Task[]>
  update(task: Task): Promise<Task>
  deleteById(id: number): Promise<void>
}

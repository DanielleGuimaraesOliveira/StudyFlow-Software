import { NotFoundError } from '../../shared/errors/errors'
import { Task } from '../../domain/task/task-entity'
import { TaskStatus } from '../../domain/task/task-enums'
import { TaskDTO } from './dto/service-dto'

export interface TaskRepository {
  save(task: Task): Promise<Task>
  findById(id: number): Promise<Task | null>
  findAll(): Promise<Task[]>
  findByStatus(status: TaskStatus): Promise<Task[]>
  update(task: Task): Promise<Task>
  deleteById(id: number): Promise<void>
}

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(dto: TaskDTO): Promise<Task> {
    const task = new Task({
      id: 0,
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      createdAt: dto.createdAt,
      deadline: dto.deadline,
    })
    return this.taskRepository.save(task)
  }

  async searchById(id: number): Promise<Task> {
    const task = await this.taskRepository.findById(id)
    if (!task)
      throw new NotFoundError(`
Task with ID ${id} was not found`)
    return task
  }

  async listAll(): Promise<Task[]> {
    return this.taskRepository.findAll()
  }

  async listByStatus(status: TaskStatus): Promise<Task[]> {
    return this.taskRepository.findByStatus(status)
  }

  async startTask(id: number): Promise<Task> {
    const task = await this.searchById(id)
    if (!task) throw new NotFoundError(`Task with ID ${id} was not found`)

    task.setStatusInProgress()
    return await this.taskRepository.update(task)
  }

  async doneTask(id: number): Promise<Task> {
    const task = await this.searchById(id)
    if (!task) throw new NotFoundError(`Task with ID ${id} was not found`)
    task.setStatusDone()
    return await this.taskRepository.update(task)
  }

  async changeTitle(id: number, newTitle: string): Promise<Task> {
    const task = await this.searchById(id)
    if (!task) throw new NotFoundError(`Task with ID ${id} was not found`)
    task.setNewTitle(newTitle)
    return await this.taskRepository.update(task)
  }

  async changeDescription(id: number, newDescription: string): Promise<Task> {
    const task = await this.searchById(id)
    task.setNewDescription(newDescription)
    return await this.taskRepository.update(task)
  }

  async delete(id: number): Promise<void> {
    const task = await this.searchById(id)
    if (!task) throw new NotFoundError(`Task with ID ${id} was not found`)
    await this.taskRepository.deleteById(id)
  }
}

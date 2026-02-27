import { NotFoundError } from '../../shared/errors/errors'
import { Task } from '../../domain/task/entities/task-entity'
import { TaskStatus } from '../../domain/task/entities/task-enums'
import { TaskDTO } from './dto/service-dto'
import { TaskRepository } from '../../domain/task/repositories/task-repository.interface'

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

    task.setStatusInProgress()
    return await this.taskRepository.update(task)
  }

  async doneTask(id: number): Promise<Task> {
    const task = await this.searchById(id)
    task.setStatusDone()
    return await this.taskRepository.update(task)
  }

  async changeTitle(id: number, newTitle: string): Promise<Task> {
    const task = await this.searchById(id)
    task.setNewTitle(newTitle)
    return await this.taskRepository.update(task)
  }

  async changeDescription(id: number, newDescription: string): Promise<Task> {
    const task = await this.searchById(id)
    task.setNewDescription(newDescription)
    return await this.taskRepository.update(task)
  }

  async delete(id: number): Promise<void> {
    await this.searchById(id)
    await this.taskRepository.deleteById(id)
  }
}

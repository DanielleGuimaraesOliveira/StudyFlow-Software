import { Request, Response } from 'express'
import { TaskDTO } from '../../../application/task/dto/service-dto'
import { TaskService } from '../../../application/task/task-service'
import { TaskStatus } from '../../../domain/task/task-enums'
import { DomainError, NotFoundError } from '../../../shared/errors/errors'
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  async registerTask(request: Request, response: Response): Promise<void> {
    const dto: TaskDTO = request.body
    const task = await this.taskService.create(dto)
    response.status(201).json(task)
  }

  async findById(request: Request, response: Response): Promise<void> {
    const id = parseInt(request.params.id)
    const task = await this.taskService.searchById(id)
    response.status(200).json(task)
  }

  async showAllTasks(request: Request, response: Response): Promise<void> {
    const tasks = await this.taskService.listAll()
    response.status(200).json(tasks)
  }

  async showByStatus(request: Request, response: Response): Promise<void> {
    const statusDaTask = request.params.taskStatus as TaskStatus
    const listaDeTasks = await this.taskService.listByStatus(statusDaTask)
    response.status(200).json(listaDeTasks)
  }

  async startTask(request: Request, response: Response): Promise<void> {
    const id = parseInt(request.params.id)
    const task = await this.taskService.startTask(id)
    response.status(200).json(task)
  }

  async doneTask(request: Request, response: Response): Promise<void> {
    const id = parseInt(request.params.id)
    const task = await this.taskService.doneTask(id)
    response.status(200).json(task)
  }

  async changeTitle(request: Request, response: Response): Promise<void> {
    const id = parseInt(request.params.id)
    const title = request.params.title
    const task = await this.taskService.changeTitle(id, title)
    response.status(200).json(task)
  }

  async changeDescription(request: Request, response: Response): Promise<void> {
    const id = parseInt(request.params.id)
    const description = request.params.description
    const task = await this.taskService.changeDescription(id, description)
    response.status(200).json(task)
  }

  async deleteTask(request: Request, response: Response): Promise<void> {
    const id = parseInt(request.params.id)
    await this.taskService.delete(id)
    response.status(200).json('Task deleted successfully')
  }
}

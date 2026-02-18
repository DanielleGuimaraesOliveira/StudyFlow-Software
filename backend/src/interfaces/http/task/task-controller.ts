import { Request, Response } from 'express'
import { TaskDTO } from '../../../application/task/dto/service-dto'
import { TaskService } from '../../../application/task/task-service'
import { TaskStatus } from '../../../domain/task/task-enums'
import { DomainError, NotFoundError } from '../../../shared/errors/errors'
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  async registerTask(request: Request, response: Response): Promise<void> {
    try {
      const dto: TaskDTO = request.body
      const task = await this.taskService.create(dto)
      response.status(201).json(task)
    } catch (error) {
      const message = (error as Error).message

      if (error instanceof DomainError) {
        response.status(400).json({ error: message })
        return
      }

      response.status(500).json({ error: 'Internal server error' })
    }
  }

  async findById(request: Request, response: Response): Promise<void> {
    try {
      const id = parseInt(request.params.id)
      const task = await this.taskService.searchById(id)
      response.status(200).json(task)
    } catch (error) {
      const message = (error as Error).message

      if (error instanceof NotFoundError) {
        response.status(404).json({ error: message })
        return
      }

      response.status(500).json({ error: 'Internal server error' })
    }
  }

  async showAllTasks(request: Request, response: Response): Promise<void> {
    try {
      const tasks = await this.taskService.listAll()
      response.status(200).json(tasks)
      return
    } catch {
      response.status(500).json({ error: 'Internal server error' })
      return
    }
  }

  async showByStatus(request: Request, response: Response): Promise<void> {
    try {
      const statusDaTask = request.params.taskStatus as TaskStatus
      const listaDeTasks = await this.taskService.listByStatus(statusDaTask)
      response.status(200).json(listaDeTasks)
      return
    } catch {
      response.status(500).json({ error: 'Internal server error' })
    }
  }

  async startTask(request: Request, response: Response): Promise<void> {
    try {
      const id = parseInt(request.params.id)
      const task = await this.taskService.startTask(id)
      response.status(200).json(task)
      return
    } catch (error) {
      const message = (error as Error).message

      if (error instanceof NotFoundError) {
        response.status(404).json({ error: message })
        return
      }
      if (error instanceof DomainError) {
        response.status(422).json({ error: message })
        return
      }
      response.status(500).json({ error: 'Internal server error' })
    }
  }

  async doneTask(request: Request, response: Response): Promise<void> {
    try {
      const id = parseInt(request.params.id)
      const task = await this.taskService.doneTask(id)
      response.status(200).json(task)
      return
    } catch (error) {
      const message = (error as Error).message

      if (error instanceof NotFoundError) {
        response.status(404).json({ error: message })
        return
      }
      if (error instanceof DomainError) {
        response.status(422).json({ error: message })
        return
      }
      response.status(500).json({ error: 'Internal server error' })
    }
  }

  async changeTitle(request: Request, response: Response): Promise<void> {
    try {
      const id = parseInt(request.params.id)
      const title = request.params.title
      const task = await this.taskService.changeTitle(id, title)
      response.status(200).json(task)
      return
    } catch (error) {
      const message = (error as Error).message

      if (error instanceof NotFoundError) {
        response.status(404).json({ error: message })
        return
      }

      if (error instanceof DomainError) {
        response.status(422).json({ error: message })
        return
      }

      response.status(500).json({ error: 'Internal server error' })
    }
  }

  async changeDescription(request: Request, response: Response): Promise<void> {
    try {
      const id = parseInt(request.params.id)
      const description = request.params.description
      const task = await this.taskService.changeDescription(id, description)
      response.status(200).json(task)
      return
    } catch (error) {
      const message = (error as Error).message

      if (error instanceof NotFoundError) {
        response.status(404).json({ error: message })
        return
      }

      response.status(500).json({ error: 'Internal server error' })
    }
  }

  async deleteTask(request: Request, response: Response): Promise<void> {
    try {
      const id = parseInt(request.params.id)
      await this.taskService.delete(id)
      response.status(200).json('Task deleted successfully')
      return
    } catch (error) {
      const message = (error as Error).message
      if (error instanceof NotFoundError) {
        response.status(404).json({ error: message })
        return
      }
      response.status(500).json({ error: 'Internal server error' })
    }
  }
}

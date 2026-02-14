import { TaskService } from '../../../application/task/task-service'
import { Request, Response } from 'express'
import { TaskController } from '../task/task-controller'
import { Task } from '../../../domain/task/task-entity'
import { TaskStatus } from '../../../domain/task/task-enums'
import { DomainError, NotFoundError, ValidationError } from '../../../shared/errors/errors'

describe('TaskController', () => {
  const task = (
    id: number,
    status: TaskStatus = TaskStatus.Pending,
    title: string = 'Test',
    description: string = 'Desc'
  ) => new Task({ id, title, description, status: status })

  let taskServiceMock: jest.Mocked<TaskService>
  let taskController: TaskController
  let responseMock: Partial<Response>
  let requestMock: Partial<Request>

  beforeEach(() => {
    taskServiceMock = {
      create: jest.fn(),
      searchById: jest.fn(),
      listAll: jest.fn(),
      listByStatus: jest.fn(),
      startTask: jest.fn(),
      doneTask: jest.fn(),
      changeTitle: jest.fn(),
      changeDescription: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TaskService>

    responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    }

    requestMock = {
      body: {},
      params: {},
    }

    taskController = new TaskController(taskServiceMock)
  })

  describe('CreateTask', () => {
    it('Should create a task successfully', async () => {
      const taskDTO = {
        id: 1,
        titulo: 'New Task',
        descricao: 'New Description',
      }
      requestMock.body = taskDTO

      const createdTask = task(1)

      taskServiceMock.create.mockResolvedValue(createdTask)

      await taskController.registerTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(201)
      expect(responseMock.json).toHaveBeenLastCalledWith(createdTask)
    })

    it('Should return an error when creating a task without a title', async () => {
      taskServiceMock.create.mockRejectedValue(new ValidationError('Task title is required'))

      requestMock.body = { descricao: 'Description' }

      await taskController.registerTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(400)
      expect(responseMock.json).toHaveBeenCalledWith({
        error: 'Task title is required',
      })
    })

    it('Should return an error when creating a task with less than 3 characters', async () => {
      taskServiceMock.create.mockRejectedValue(
        new DomainError('Title must be at least 3 characters long')
      )

      requestMock.body = { titulo: '1a', descricao: 'descricao' }

      await taskController.registerTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(400)
      expect(responseMock.json).toHaveBeenCalledWith({
        error: 'Title must be at least 3 characters long',
      })
    })
  })

  describe('GetTaskById', () => {
    it('Should get a task by id successfully', async () => {
      const createdTask = task(1)
      taskServiceMock.searchById.mockResolvedValue(createdTask)

      requestMock.params = { id: '1' }

      await taskController.findById(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(200)
      expect(responseMock.json).toHaveBeenCalledWith(createdTask)
    })

    it('Should return an error when a task by id is not found', async () => {
      taskServiceMock.searchById.mockRejectedValue(
        new NotFoundError('Task with ID 1 was not found')
      )
      requestMock.params = { id: '1' }

      await taskController.findById(requestMock as Request, responseMock as Response)
      expect(responseMock.status).toHaveBeenCalledWith(404)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Task with ID 1 was not found' })
    })

    it('Should return an unexpected error when getting a task by id', async () => {
      taskServiceMock.searchById.mockRejectedValue(new Error('Database connection failure'))
      requestMock.params = { id: '3' }

      await taskController.findById(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(500)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Internal server error' })
    })
  })

  describe('ListTasks', () => {
    it('Should list tasks successfully', async () => {
      const createdTasks = [task(1), task(2)]
      taskServiceMock.listAll.mockResolvedValue(createdTasks)

      await taskController.showAllTasks(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(200)
      expect(responseMock.json).toHaveBeenCalledWith(createdTasks)
      expect(responseMock.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 1 }),
          expect.objectContaining({ id: 2 }),
        ])
      )
    })

    it('Should return an unexpected error when listing tasks', async () => {
      taskServiceMock.listAll.mockRejectedValue(new Error('Database connection failure'))

      await taskController.showAllTasks(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(500)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Internal server error' })
    })
  })

  describe('ListTasksByStatus', () => {
    it('Should list tasks by status successfully', async () => {
      const createdTasks = [task(1, TaskStatus.Done), task(2, TaskStatus.Pending)]
      taskServiceMock.listByStatus.mockResolvedValue(createdTasks)

      await taskController.showByStatus(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(200)
      expect(responseMock.json).toHaveBeenCalledWith(createdTasks)
      expect(responseMock.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ status: TaskStatus.Done }),
          expect.objectContaining({ status: TaskStatus.Pending }),
        ])
      )
    })

    it('Should return an unexpected error when listing tasks by status', async () => {
      taskServiceMock.listByStatus.mockRejectedValue(new Error('Database connection failure'))

      await taskController.showByStatus(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(500)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Internal server error' })
    })
  })

  describe('StartTask', () => {
    it('Should start a task successfully', async () => {
      const createdTask = task(1, TaskStatus.InProgress)
      taskServiceMock.startTask.mockResolvedValue(createdTask)
      requestMock.params = { id: '1', taskStatus: TaskStatus.Pending }

      await taskController.startTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(200)
      expect(responseMock.json).toHaveBeenCalledWith(createdTask)
      expect(responseMock.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'In Progress' })
      )
    })

    it('Should return an error when trying to start a non-existent task', async () => {
      taskServiceMock.startTask.mockRejectedValue(new NotFoundError('Task with ID 1 was not found'))
      requestMock.params = { id: '1' }

      await taskController.startTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(404)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Task with ID 1 was not found' })
    })

    it('Should return an error when trying to start a task with an invalid status', async () => {
      taskServiceMock.startTask.mockRejectedValue(
        new DomainError('Only pending tasks can be started')
      )
      requestMock.params = { id: '1' }

      await taskController.startTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(422)
      expect(responseMock.json).toHaveBeenCalledWith({
        error: 'Only pending tasks can be started',
      })
    })

    it('Should return an unexpected error when starting a task', async () => {
      taskServiceMock.startTask.mockRejectedValue(new Error('Database connection failure'))
      requestMock.params = { id: '1' }

      await taskController.startTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(500)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Internal server error' })
    })
  })

  describe('CompleteTask', () => {
    it('Should complete a task successfully', async () => {
      const createdTask = task(1, TaskStatus.Done)
      taskServiceMock.doneTask.mockResolvedValue(createdTask)
      requestMock.params = { id: '1' }

      await taskController.doneTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(200)
      expect(responseMock.json).toHaveBeenCalledWith(createdTask)
      expect(responseMock.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: TaskStatus.Done })
      )
    })

    it('Should return an error when trying to complete a non-existent task', async () => {
      taskServiceMock.doneTask.mockRejectedValue(new NotFoundError('Task with ID 1 was not found'))
      requestMock.params = { id: '1' }

      await taskController.doneTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(404)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Task with ID 1 was not found' })
    })

    it('Should return an error when trying to complete a task with an invalid status', async () => {
      taskServiceMock.doneTask.mockRejectedValue(
        new DomainError('Only in-progress tasks can be completed')
      )
      requestMock.params = { id: '1' }

      await taskController.doneTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(422)
      expect(responseMock.json).toHaveBeenCalledWith({
        error: 'Only in-progress tasks can be completed',
      })
    })

    it('Should return an unexpected error when completing a task', async () => {
      taskServiceMock.doneTask.mockRejectedValue(new Error('Database connection failure'))
      requestMock.params = { id: '1' }

      await taskController.doneTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(500)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Internal server error' })
    })
  })

  describe('ChangeTaskTitle', () => {
    it('Should change the title successfully', async () => {
      const createdTask = task(1, TaskStatus.Pending, 'newTitle')
      taskServiceMock.changeTitle.mockResolvedValue(createdTask)

      requestMock.params = { id: '1', title: 'newTitle' }

      await taskController.changeTitle(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(200)
      expect(responseMock.json).toHaveBeenCalledWith(createdTask)
      expect(responseMock.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'newTitle' }))
    })

    it('Should return an error when trying to change the title of a non-existent task', async () => {
      taskServiceMock.changeTitle.mockRejectedValue(
        new NotFoundError('Task with ID 1 was not found')
      )
      requestMock.params = { id: '1' }

      await taskController.changeTitle(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(404)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Task with ID 1 was not found' })
    })

    it('Should return an error when trying to change the title to empty', async () => {
      taskServiceMock.changeTitle.mockRejectedValue(new DomainError('Title is required'))
      requestMock.params = { id: '1', titulo: '' }

      await taskController.changeTitle(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(422)
      expect(responseMock.json).toHaveBeenCalledWith({
        error: 'Title is required',
      })
    })

    it('Should return an unexpected error when changing the title', async () => {
      taskServiceMock.changeTitle.mockRejectedValue(new Error('Database connection failure'))
      requestMock.params = { id: '1' }

      await taskController.changeTitle(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(500)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Internal server error' })
    })
  })

  describe('ChangeTaskDescription', () => {
    it('Should change the description successfully', async () => {
      const createdTask = task(1, TaskStatus.Pending, 'title', 'newDescription')
      taskServiceMock.changeDescription.mockResolvedValue(createdTask)

      requestMock.params = { id: '1', description: 'newDescription' }

      await taskController.changeDescription(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(200)
      expect(responseMock.json).toHaveBeenCalledWith(createdTask)
      expect(responseMock.json).toHaveBeenCalledWith(
        expect.objectContaining({ description: 'newDescription' })
      )
    })

    it('Should return an error when trying to change the description of a non-existent task', async () => {
      taskServiceMock.changeDescription.mockRejectedValue(
        new NotFoundError('Task with ID 1 was not found')
      )
      requestMock.params = { id: '1', descricao: 'novaDescricao' }

      await taskController.changeDescription(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(404)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Task with ID 1 was not found' })
    })

    it('Should return an unexpected error when changing the description', async () => {
      taskServiceMock.changeDescription.mockRejectedValue(new Error('Database connection failure'))
      requestMock.params = { id: '1', descricao: 'Desc ' }

      await taskController.changeDescription(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(500)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Internal server error' })
    })
  })

  describe('DeleteTask', () => {
    it('Should delete a task successfully', async () => {
      taskServiceMock.delete.mockResolvedValue(undefined)

      requestMock.params = { id: '1' }

      await taskController.deleteTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(200)
      expect(responseMock.json).toHaveBeenCalledWith('Task deleted successfully')
    })

    it('Should return an error when trying to delete a non-existent task', async () => {
      taskServiceMock.delete.mockRejectedValue(new NotFoundError('Task with ID 1 was not found'))
      requestMock.params = { id: '1' }

      await taskController.deleteTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(404)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Task with ID 1 was not found' })
    })

    it('Should return an unexpected error when deleting a task', async () => {
      taskServiceMock.delete.mockRejectedValue(new Error('Database connection failure'))
      requestMock.params = { id: '1' }

      await taskController.deleteTask(requestMock as Request, responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(500)
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Internal server error' })
    })
  })
})

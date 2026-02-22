import { TaskRepository, TaskService } from '../../../application/task/task-service'
import { Task } from '../../../domain/task/task-entity'
import { TaskStatus } from '../../../domain/task/task-enums'

describe('TaskService', () => {
  const createTask = (
    id: number,
    status: TaskStatus = TaskStatus.Pending,
    title: string = 'Test',
    description: string = 'Desc'
  ) => new Task({ id, title, description, status })
  let taskService: TaskService
  let taskRepositoryMock: jest.Mocked<TaskRepository>

  beforeEach(() => {
    taskRepositoryMock = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByStatus: jest.fn(),
      update: jest.fn(),
      deleteById: jest.fn(),
    }

    taskService = new TaskService(taskRepositoryMock)
  })

  it('Should create a task and delegate to the repository', async () => {
    const createdTask = createTask(1)

    taskRepositoryMock.save.mockResolvedValue(createdTask)
    const result = await taskService.create({ title: 'Test', description: 'Desc' })

    expect(result).toBe(createdTask)
    expect(taskRepositoryMock.save).toHaveBeenCalledWith(expect.any(Task))
  })

  it('Should get a task by id when it exists', async () => {
    const createdTask = createTask(2)

    taskRepositoryMock.findById.mockResolvedValue(createdTask)
    const result = await taskService.searchById(2)
    expect(result).toEqual(createdTask)
    expect(taskRepositoryMock.findById).toHaveBeenCalledWith(2)
  })

  it('Should throw when a task id is not found', async () => {
    taskRepositoryMock.findById.mockResolvedValue(null)

    await expect(taskService.searchById(2)).rejects.toThrow('Task with ID 2 was not found')
  })

  it('Should return a list of tasks', async () => {
    const taskList = [createTask(1)]
    taskRepositoryMock.findAll.mockResolvedValue(taskList)
    const result = await taskService.listAll()

    expect(taskRepositoryMock.findAll).toHaveBeenCalledTimes(1)
    expect(result).toEqual(taskList)
  })

  it('Should return a list filtered by status', async () => {
    const pendingTasks = [createTask(1), createTask(2)]
    taskRepositoryMock.findByStatus.mockResolvedValue(pendingTasks)

    const result = await taskService.listByStatus(TaskStatus.Pending)

    expect(taskRepositoryMock.findByStatus).toHaveBeenCalledWith(TaskStatus.Pending)
    expect(result).toBe(pendingTasks)
  })

  it('Should start a task successfully', async () => {
    const createdTask = createTask(1)

    taskRepositoryMock.findById.mockResolvedValue(createdTask)
    taskRepositoryMock.update.mockResolvedValue(createdTask)

    await taskService.startTask(1)

    expect(taskRepositoryMock.findById).toHaveBeenCalledWith(1)

    expect(taskRepositoryMock.update).toHaveBeenCalledWith(
      expect.objectContaining({
        getTaskStatus: expect.any(Function),
      })
    )
    const updatedTask = taskRepositoryMock.update.mock.calls[0][0] as Task
    expect(updatedTask.getTaskStatus()).toBe(TaskStatus.InProgress)
  })

  it('Should throw when starting a task with a missing id', async () => {
    taskRepositoryMock.findById.mockResolvedValue(null)
    await expect(taskService.startTask(1)).rejects.toThrow('Task with ID 1 was not found')
    expect(taskRepositoryMock.update).not.toHaveBeenCalled()
  })

  it('Should propagate errors when updating a task on start', async () => {
    const createdTask = createTask(1)
    taskRepositoryMock.findById.mockResolvedValue(createdTask)
    taskRepositoryMock.update.mockRejectedValue(new Error('Update failed'))

    await expect(taskService.startTask(1)).rejects.toThrow('Update failed')
    expect(taskRepositoryMock.findById).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.update).toHaveBeenCalledWith(createdTask)
  })

  it('Should complete a task and update it correctly', async () => {
    const createdTask = createTask(1, TaskStatus.InProgress)
    const updatedTaskMock = createTask(1, TaskStatus.Done)
    taskRepositoryMock.findById.mockResolvedValue(createdTask)
    taskRepositoryMock.update.mockResolvedValue(updatedTaskMock)

    await taskService.doneTask(1)

    expect(taskRepositoryMock.findById).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.update).toHaveBeenCalledWith(
      expect.objectContaining({ getTaskStatus: expect.any(Function) })
    )
    const updatedTask = taskRepositoryMock.update.mock.calls[0][0] as Task
    expect(updatedTask.getTaskStatus()).toBe(TaskStatus.Done)
  })

  it('Should throw when completing a task with a missing id', async () => {
    taskRepositoryMock.findById.mockResolvedValue(null)
    await expect(taskService.doneTask(1)).rejects.toThrow('Task with ID 1 was not found')
    expect(taskRepositoryMock.update).not.toHaveBeenCalled()
  })

  it('Should propagate errors when updating a task on complete', async () => {
    const createdTask = createTask(1, TaskStatus.InProgress)
    taskRepositoryMock.findById.mockResolvedValue(createdTask)
    taskRepositoryMock.update.mockRejectedValue(new Error('Update failed'))

    await expect(taskService.doneTask(1)).rejects.toThrow('Update failed')
    expect(taskRepositoryMock.findById).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.update).toHaveBeenCalledWith(createdTask)
  })

  it('Should change a task title successfully', async () => {
    const createdTask = createTask(1)
    const updatedTaskMock = createTask(1, TaskStatus.Pending, 'newTitle')
    taskRepositoryMock.findById.mockResolvedValue(createdTask)
    taskRepositoryMock.update.mockResolvedValue(updatedTaskMock)

    await taskService.changeTitle(1, 'newTitle')

    expect(taskRepositoryMock.findById).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.update).toHaveBeenCalledWith(expect.any(Task))

    const updatedTask = taskRepositoryMock.update.mock.calls[0][0] as Task
    expect(updatedTask.getTitle()).toBe('newTitle')
  })

  it('Should throw when changing title with a missing id', async () => {
    taskRepositoryMock.findById.mockResolvedValue(null)
    await expect(taskService.changeTitle(1, 'newTitle')).rejects.toThrow(
      'Task with ID 1 was not found'
    )
    expect(taskRepositoryMock.update).not.toHaveBeenCalled()
  })

  it('Should propagate errors when updating a task title', async () => {
    const createdTask = createTask(1)
    taskRepositoryMock.findById.mockResolvedValue(createdTask)
    taskRepositoryMock.update.mockRejectedValue(new Error('Update failed'))

    await expect(taskService.changeTitle(1, 'newTitle')).rejects.toThrow('Update failed')
    expect(taskRepositoryMock.findById).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.update).toHaveBeenCalledWith(createdTask)
  })

  it('Should change a task description successfully', async () => {
    const createdTask = createTask(1)
    const updatedTaskMock = createTask(1, TaskStatus.Pending, 'Test', 'newDescription')
    taskRepositoryMock.findById.mockResolvedValue(createdTask)
    taskRepositoryMock.update.mockResolvedValue(updatedTaskMock)

    await taskService.changeDescription(1, 'newDescription')

    expect(taskRepositoryMock.findById).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.update).toHaveBeenCalledWith(expect.any(Task))

    const updatedTask = taskRepositoryMock.update.mock.calls[0][0] as Task
    expect(updatedTask.getDescription()).toBe('newDescription')
  })

  it('Should throw when changing description with a missing id', async () => {
    taskRepositoryMock.findById.mockResolvedValue(null)
    await expect(taskService.changeDescription(1, 'newDescription')).rejects.toThrow(
      'Task with ID 1 was not found'
    )
    expect(taskRepositoryMock.update).not.toHaveBeenCalled()
  })

  it('Should propagate errors when updating a task description', async () => {
    const createdTask = createTask(1)
    taskRepositoryMock.findById.mockResolvedValue(createdTask)
    taskRepositoryMock.update.mockRejectedValue(new Error('Update failed'))

    await expect(taskService.changeDescription(1, 'new description')).rejects.toThrow(
      'Update failed'
    )
    expect(taskRepositoryMock.findById).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.update).toHaveBeenCalledWith(createdTask)
  })

  it('Should delete a task successfully', async () => {
    taskRepositoryMock.deleteById.mockResolvedValue()
    const createdTask = createTask(1)
    taskRepositoryMock.findById.mockResolvedValue(createdTask)
    await taskService.delete(1)

    expect(taskRepositoryMock.deleteById).toHaveBeenCalledWith(1)
  })

  it('Should throw when deleting a task with a missing id', async () => {
    taskRepositoryMock.findById.mockResolvedValue(null)
    await expect(taskService.delete(1)).rejects.toThrow('Task with ID 1 was not found')

    expect(taskRepositoryMock.deleteById).not.toHaveBeenCalled()
  })
})

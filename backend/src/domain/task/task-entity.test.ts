import { Task } from '../task/task-entity'
import { TaskStatus, TaskPriority } from '../task/task-enums'

describe('Task', () => {
  it('Should create a task with the right properties', () => {
    const createdAt = new Date('2024-06-01')
    const deadline = new Date('2025-06-01')
    const task = new Task({
      id: 1,
      title: 'Study Typescript',
      description: 'read documentation',
      createdAt: createdAt,
      priority: TaskPriority.Low,
      status: TaskStatus.Pending,
      deadline: deadline,
    })

    expect(task.getId()).toBe(1)
    expect(task.getTitle()).toBe('Study Typescript')
    expect(task.getDescription()).toBe('read documentation')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pending)
    expect(task.getTaskPriority()).toBe(TaskPriority.Low)
    expect(task.getCreatedAt()).toBe(createdAt)
    expect(task.getDeadline()).toBe(deadline)
  })

  it('Should create a task with the default date', () => {
    const oldDate = new Date()
    const deadline = new Date('2027-06-01')
    const task = new Task({
      id: 2,
      title: 'Do exercices',
      description: 'Solve Problems',
      priority: TaskPriority.Low,
      status: TaskStatus.Pending,
      deadline: deadline,
    })
    const newDate = new Date()

    expect(task.getId()).toBe(2)
    expect(task.getTitle()).toBe('Do exercices')
    expect(task.getDescription()).toBe('Solve Problems')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pending)
    expect(task.getTaskPriority()).toBe(TaskPriority.Low)
    expect(task.getCreatedAt().getTime()).toBeLessThanOrEqual(newDate.getTime())
    expect(task.getCreatedAt().getTime()).toBeGreaterThanOrEqual(oldDate.getTime())
    expect(task.getCreatedAt().getDate()).toBe(oldDate.getDate())
    expect(task.getDeadline()).toBe(deadline)
  })

  it('Should change status from pending to in progress', () => {
    const createdAt = new Date('2020-06-12')
    const deadline = new Date('2025-06-01')
    const task = new Task({
      id: 3,
      title: 'Study English',
      description: 'Reach C2 level',
      priority: TaskPriority.Low,
      status: TaskStatus.Pending,
      createdAt: createdAt,
      deadline: deadline,
    })

    expect(task.getTaskStatus()).toBe(TaskStatus.Pending)
    task.setStatusInProgress()
    expect(task.getId()).toBe(3)
    expect(task.getTitle()).toBe('Study English')
    expect(task.getDescription()).toBe('Reach C2 level')
    expect(task.getTaskPriority()).toBe(TaskPriority.Low)
    expect(task.getTaskStatus()).toBe(TaskStatus.InProgress)
    expect(task.getCreatedAt()).toBe(createdAt)
    expect(task.getDeadline()).toBe(deadline)
  })

  it('Should change status from in progress to done', () => {
    const createdAt = new Date('2020-06-12')
    const deadline = new Date('2023-06-01')
    const task = new Task({
      id: 4,
      title: 'Study Java',
      description: 'Read the official Java documentation',
      createdAt: createdAt,
      priority: TaskPriority.Low,
      status: TaskStatus.InProgress,
      deadline: deadline,
    })

    expect(task.getTaskStatus()).toBe(TaskStatus.InProgress)
    task.setStatusDone()
    expect(task.getId()).toBe(4)
    expect(task.getTitle()).toBe('Study Java')
    expect(task.getDescription()).toBe('Read the official Java documentation')
    expect(task.getTaskStatus()).toBe(TaskStatus.Done)
    expect(task.getTaskPriority()).toBe(TaskPriority.Low)
    expect(task.getCreatedAt()).toBe(createdAt)
    expect(task.getDeadline()).toBe(deadline)
  })

  it('Should throw when moving to in progress from a non-pending status', () => {
    const createdAt = new Date('2024-03-01')
    const deadline = new Date('2025-05-01')
    const task = new Task({
      id: 5,
      title: 'Study Python',
      description: 'Read the official Python documentation',
      createdAt: createdAt,
      priority: TaskPriority.Low,
      status: TaskStatus.Done,
      deadline: deadline,
    })

    expect(task.getId()).toBe(5)
    expect(task.getTitle()).toBe('Study Python')
    expect(task.getDescription()).toBe('Read the official Python documentation')
    expect(() => task.setStatusInProgress()).toThrow('Only pending tasks can be started')
    expect(task.getTaskStatus()).toBe(TaskStatus.Done)
    expect(task.getTaskPriority()).toBe(TaskPriority.Low)
    expect(task.getCreatedAt()).toBe(createdAt)
    expect(task.getDeadline()).toBe(deadline)
  })

  it('Should throw when completing a task that is not in progress', () => {
    const createdAt = new Date('2024-03-01')
    const deadline = new Date('2025-05-01')
    const task = new Task({
      id: 10,
      title: 'Study Ruby',
      description: 'Read the official Ruby documentation',
      createdAt: createdAt,
      priority: TaskPriority.Low,
      status: TaskStatus.Pending,
      deadline: deadline,
    })

    expect(task.getId()).toBe(10)
    expect(task.getTitle()).toBe('Study Ruby')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pending)
    expect(() => task.setStatusDone()).toThrow('Only tasks in progress can be completed')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pending)
    expect(task.getTaskPriority()).toBe(TaskPriority.Low)
  })

  it('Should change the task title', () => {
    const createdAt = new Date('2020-06-12')
    const deadline = new Date('2025-01-01')
    const task = new Task({
      id: 6,
      title: 'Study Csharp',
      description: 'Read the official Csharp documentation',
      createdAt: createdAt,
      priority: TaskPriority.Low,
      status: TaskStatus.InProgress,
      deadline: deadline,
    })
    expect(task.getTitle()).toBe('Study Csharp')
    task.setNewTitle('Study Spanish')
    expect(task.getId()).toBe(6)
    expect(task.getTitle()).toBe('Study Spanish')
    expect(task.getDescription()).toBe('Read the official Csharp documentation')
    expect(task.getTaskPriority()).toBe(TaskPriority.Low)
    expect(task.getTaskStatus()).toBe(TaskStatus.InProgress)
    expect(task.getCreatedAt()).toBe(createdAt)
    expect(task.getDeadline()).toBe(deadline)
  })

  it('Should throw when changing title to less than 3 characters', () => {
    const createdAt = new Date('2020-06-12')
    const deadline = new Date('2025-01-01')
    const task = new Task({
      id: 11,
      title: 'Study Go',
      description: 'Read the official Go documentation',
      createdAt: createdAt,
      priority: TaskPriority.High,
      status: TaskStatus.InProgress,
      deadline: deadline,
    })

    expect(task.getId()).toBe(11)
    expect(task.getTitle()).toBe('Study Go')
    expect(() => task.setNewTitle('ab')).toThrow('Title must be at least 3 characters long')
    expect(task.getTitle()).toBe('Study Go')
    expect(task.getTaskStatus()).toBe(TaskStatus.InProgress)
    expect(task.getCreatedAt()).toBe(createdAt)
  })

  it('Should throw when changing title to more than 100 characters', () => {
    const createdAt = new Date('2020-06-12')
    const deadline = new Date('2025-01-01')
    const longTitle = 'a'.repeat(101)
    const task = new Task({
      id: 11,
      title: 'Study Go',
      description: 'Read the official Go documentation',
      createdAt: createdAt,
      priority: TaskPriority.High,
      status: TaskStatus.InProgress,
      deadline: deadline,
    })

    expect(task.getId()).toBe(11)
    expect(task.getTitle()).toBe('Study Go')
    expect(() => task.setNewTitle(longTitle)).toThrow('Title must be at most 100 characters long')
    expect(task.getTitle()).toBe('Study Go')
    expect(task.getTaskStatus()).toBe(TaskStatus.InProgress)
    expect(task.getCreatedAt()).toBe(createdAt)
  })

  it('Should throw when creating a task with more than 100 characters', () => {
    const longTitle = 'a'.repeat(101)
    expect(
      () =>
        new Task({
          id: 2,
          title: longTitle,
        })
    ).toThrow('Title must be at most 100 characters long')
  })

  it('Should throw when creating a task with less than 3 characters', () => {
    expect(
      () =>
        new Task({
          id: 2,
          title: 'Im',
        })
    ).toThrow('Title must be at least 3 characters long')
  })

  it('Should throw when creating a task without a title', () => {
    expect(() => {
      new Task({
        id: 12,
        title: '',
        description: 'Description',
      })
    }).toThrow('Title is required')
  })

  it('Should create a task without description', () => {
    const task = new Task({
      id: 13,
      title: 'Study Rust',
    })

    expect(task.getId()).toBe(13)
    expect(task.getTitle()).toBe('Study Rust')
    expect(task.getDescription()).toBe('')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pending)
    expect(task.getTaskPriority()).toBe(TaskPriority.None)
  })

  it('Should change the task description', () => {
    const task = new Task({
      id: 14,
      title: 'Study Kotlin',
      description: 'Initial description',
    })

    expect(task.getDescription()).toBe('Initial description')
    task.setNewDescription('New description')
    expect(task.getDescription()).toBe('New description')
  })

  it('Should create the task deadline with the default date', () => {
    const oldDate = new Date()
    const createdAt = new Date('2024-06-01')
    const task = new Task({
      id: 7,
      title: 'Do exercises',
      description: 'Solve medium programming problems',
      priority: TaskPriority.Low,
      status: TaskStatus.Pending,
      createdAt: createdAt,
    })
    const newDate = new Date()

    expect(task.getId()).toBe(7)
    expect(task.getTitle()).toBe('Do exercises')
    expect(task.getDescription()).toBe('Solve medium programming problems')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pending)
    expect(task.getTaskPriority()).toBe(TaskPriority.Low)
    expect(task.getDeadline().getTime()).toBeLessThanOrEqual(newDate.getTime())
    expect(task.getDeadline().getTime()).toBeGreaterThanOrEqual(oldDate.getTime())
    expect(task.getCreatedAt()).toBe(createdAt)
  })

  it('Should create a task with the default priority as None', () => {
    const createdAt = new Date('2024-06-01')
    const deadline = new Date('2025-06-01')
    const task = new Task({
      id: 8,
      title: 'Study',
      description: 'Read the documentation',
      createdAt: createdAt,
      status: TaskStatus.Pending,
      deadline: deadline,
    })

    expect(task.getId()).toBe(8)
    expect(task.getTitle()).toBe('Study')
    expect(task.getDescription()).toBe('Read the documentation')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pending)
    expect(task.getTaskPriority()).toBe(TaskPriority.None)
    expect(task.getCreatedAt()).toBe(createdAt)
    expect(task.getDeadline()).toBe(deadline)
  })

  it('Should create a task with the default status as Pending', () => {
    const createdAt = new Date('2024-06-01')
    const deadline = new Date('2025-06-01')
    const task = new Task({
      id: 9,
      title: 'Study math',
      description: 'Read the documentation',
      createdAt: createdAt,
      deadline: deadline,
    })

    expect(task.getId()).toBe(9)
    expect(task.getTitle()).toBe('Study math')
    expect(task.getDescription()).toBe('Read the documentation')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pending)
    expect(task.getTaskPriority()).toBe(TaskPriority.None)
    expect(task.getCreatedAt()).toBe(createdAt)
    expect(task.getDeadline()).toBe(deadline)
  })
})

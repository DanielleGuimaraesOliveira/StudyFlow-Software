import { TaskStatus, TaskPriority } from '../task/task-enums'
import { DomainError } from '../../shared/errors/errors'
export interface TaskProperties {
  id: number
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  createdAt?: Date
  deadline?: Date
}

export class Task {
  private id: number
  private title: string
  private description: string
  private status: TaskStatus
  private priority: TaskPriority
  private createdAt: Date
  private deadline: Date

  constructor(props: TaskProperties) {
    this.validateTitle(props.title)
    const { createdAt, deadline } = this.validateDate(props.createdAt, props.deadline)

    this.id = props.id
    this.title = props.title.trim()
    this.description = props.description?.trim() ?? ''
    this.status = props.status ?? TaskStatus.Pending
    this.priority = props.priority ?? TaskPriority.None
    this.createdAt = createdAt
    this.deadline = deadline
  }

  private validateTitle(title: string): void {
    if (!title || title.trim() == '') {
      throw new DomainError('Title is required')
    }

    if (title.length < 3) {
      throw new DomainError('Title must be at least 3 characters long')
    }

    if (title.length > 100) {
      throw new DomainError('Title must be at most 100 characters long')
    }
  }

  private validateDate(
    createdAt: Date | undefined,
    deadline: Date | undefined
  ): { createdAt: Date; deadline: Date } {
    const tempCreatedAt = createdAt ?? new Date()
    const tempDeadline = deadline ?? new Date()

    if (tempDeadline < tempCreatedAt) {
      throw new DomainError('Deadline cannot be earlier than the creation date')
    }

    return { createdAt: tempCreatedAt, deadline: tempDeadline }
  }

  public getId(): number {
    return this.id
  }

  public getTitle(): string {
    return this.title
  }

  public getDescription(): string {
    return this.description
  }

  public getTaskStatus(): TaskStatus {
    return this.status
  }

  public getTaskPriority(): TaskPriority {
    return this.priority
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getDeadline(): Date {
    return this.deadline
  }

  public setStatusInProgress(): void {
    if (this.status != TaskStatus.Pending) {
      throw new DomainError('Only pending tasks can be started')
    }

    this.status = TaskStatus.InProgress
  }

  public setStatusDone(): void {
    if (this.status != TaskStatus.InProgress) {
      throw new DomainError('Only tasks in progress can be completed')
    }

    this.status = TaskStatus.Done
  }

  public setNewTitle(newTitle: string): void {
    this.validateTitle(newTitle)

    this.title = newTitle.trim()
  }

  public setNewDescription(newDescription: string): void {
    this.description = newDescription?.trim() ?? ''
  }
}

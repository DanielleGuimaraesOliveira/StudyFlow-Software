import { TaskStatus, TaskPriority } from '../../../domain/task/entities/task-enums'
export interface TaskDTO {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  createdAt?: Date
  deadline?: Date
}

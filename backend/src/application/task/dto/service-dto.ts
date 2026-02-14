import { TaskStatus, TaskPriority } from '../../../domain/task/task-enums'
export interface TaskDTO {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  createdAt?: Date
  deadline?: Date
}

import { TaskService } from '../../../application/task/task-service'
import { TaskRepositoryPg } from '../../../domain/task/task-repository'
import { TaskController } from './task-controller'

export function taskDependencies(): TaskController {
  const repository = new TaskRepositoryPg()
  const service = new TaskService(repository)
  return new TaskController(service)
}

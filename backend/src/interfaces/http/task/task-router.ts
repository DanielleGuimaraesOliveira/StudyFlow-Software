import { Router } from 'express'
import { validation } from '../../../shared/http/middlewares/validation-middleware'
import { taskDependencies } from './task-factory'
import { z } from 'zod'
import {
  taskStatusParamsSchema,
  taskIdParamsSchema,
  changeDescriptionTaskSchema,
  changeTitleTaskSchema,
  criarTaskSchema,
} from './task-schema'

const taskRouter = Router()
const taskController = taskDependencies()

taskRouter.post('/', validation(criarTaskSchema), (req, res) =>
  taskController.registerTask(req, res)
)

taskRouter.get(
  '/status/:taskStatus',
  validation(z.object({ params: taskStatusParamsSchema })),
  (req, res) => taskController.showByStatus(req, res)
)

taskRouter.get('/', (req, res) => taskController.showAllTasks(req, res))

taskRouter.get('/:id', validation(z.object({ params: taskIdParamsSchema })), (req, res) =>
  taskController.findById(req, res)
)

taskRouter.put('/:id/inicia', validation(z.object({ params: taskIdParamsSchema })), (req, res) =>
  taskController.startTask(req, res)
)

taskRouter.put('/:id/conclui', validation(z.object({ params: taskIdParamsSchema })), (req, res) =>
  taskController.doneTask(req, res)
)

taskRouter.put(
  '/:id/titulo/:titulo',
  validation(z.object({ params: changeTitleTaskSchema })),
  (req, res) => taskController.changeTitle(req, res)
)

taskRouter.put(
  '/:id/descricao/:descricao',
  validation(z.object({ params: changeDescriptionTaskSchema })),
  (req, res) => taskController.changeDescription(req, res)
)

taskRouter.delete('/:id', validation(z.object({ params: taskIdParamsSchema })), (req, res) =>
  taskController.deleteTask(req, res)
)

export default taskRouter

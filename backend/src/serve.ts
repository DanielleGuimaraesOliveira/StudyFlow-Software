import 'dotenv/config'
import express from 'express'
import { z } from 'zod'
import cors from 'cors'
import { TaskController } from './interfaces/http/task/task-controller'
import { TaskService } from './application/task/task-service'
import { TaskRepositoryPg } from './domain/task/task-repository'
import { validation } from './shared/http/middlewares/validation'
import {
  taskStatusParamsSchema,
  taskIdParamsSchema,
  changeDescriptionTaskSchema,
  changeTitleTaskSchema,
  criarTaskSchema,
} from './interfaces/http/task/task-schema'

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
)

const repository = new TaskRepositoryPg()
const service = new TaskService(repository)
const taskController = new TaskController(service)

app.post('/tasks', validation(criarTaskSchema), (req, res) => taskController.registerTask(req, res))

app.get(
  '/tasks/status/:taskStatus',
  validation(z.object({ params: taskStatusParamsSchema })),
  (req, res) => taskController.showByStatus(req, res)
)

app.get('/tasks', (req, res) => taskController.showAllTasks(req, res))

app.get('/tasks/:id', validation(z.object({ params: taskIdParamsSchema })), (req, res) =>
  taskController.findById(req, res)
)

app.put('/tasks/:id/inicia', validation(z.object({ params: taskIdParamsSchema })), (req, res) =>
  taskController.startTask(req, res)
)

app.put('/tasks/:id/conclui', validation(z.object({ params: taskIdParamsSchema })), (req, res) =>
  taskController.doneTask(req, res)
)

app.put(
  '/tasks/:id/titulo/:titulo',
  validation(z.object({ params: changeTitleTaskSchema })),
  (req, res) => taskController.changeTitle(req, res)
)

app.put(
  '/tasks/:id/descricao/:descricao',
  validation(z.object({ params: changeDescriptionTaskSchema })),
  (req, res) => taskController.changeDescription(req, res)
)

app.delete('/tasks/:id', validation(z.object({ params: taskIdParamsSchema })), (req, res) =>
  taskController.deleteTask(req, res)
)

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Servidor rodando na porta 3000')
})

import 'dotenv/config'
import express from 'express'
import { z } from 'zod'
import cors from 'cors'
import { TaskController } from './modulos/Task/http/TaskController'
import { TaskService } from './modulos/Task/aplicacao/TaskService'
import { TaskRepositoryPg } from './modulos/Task/infra/repositorio/TaskRepository'
import { validacao } from './Shared/http/middlewares/validacao'
import {
  taskStatusParamsSchema,
  taskIdParamsSchema,
  alterarDescricaoSchema,
  alterarTituloSchema,
  criarTaskSchema,
} from './modulos/Task/http/TaskSchema'

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

app.post('/tasks', validacao(criarTaskSchema), (req, res) => taskController.criaTask(req, res))

app.get(
  '/tasks/status/:taskStatus',
  validacao(z.object({ params: taskStatusParamsSchema })),
  (req, res) => taskController.listaTaskPorStatus(req, res)
)

app.get('/tasks', (req, res) => taskController.listaTask(req, res))

app.get('/tasks/:id', validacao(z.object({ params: taskIdParamsSchema })), (req, res) =>
  taskController.obterTaskPorId(req, res)
)

app.put('/tasks/:id/inicia', validacao(z.object({ params: taskIdParamsSchema })), (req, res) =>
  taskController.iniciarTask(req, res)
)

app.put('/tasks/:id/conclui', validacao(z.object({ params: taskIdParamsSchema })), (req, res) =>
  taskController.concluirTask(req, res)
)

app.put(
  '/tasks/:id/titulo/:titulo',
  validacao(z.object({ params: alterarTituloSchema })),
  (req, res) => taskController.alterarTituloTask(req, res)
)

app.put(
  '/tasks/:id/descricao/:descricao',
  validacao(z.object({ params: alterarDescricaoSchema })),
  (req, res) => taskController.alterarDescricaoTask(req, res)
)

app.delete('/tasks/:id', validacao(z.object({ params: taskIdParamsSchema })), (req, res) =>
  taskController.deletarTask(req, res)
)

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})

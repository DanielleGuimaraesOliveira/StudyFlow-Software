import 'dotenv/config'
import express from 'express'
import { TaskController } from './modulos/Task/TaskController'
import { TaskService } from './modulos/Task/aplicacao/TaskService'
import { TaskRepositoryPrisma } from './modulos/Task/TaskRepository'

const app = express()

// Parse JSON body
app.use(express.json())

const repository = new TaskRepositoryPrisma()
const service = new TaskService(repository)
const taskController = new TaskController(service)

app.post('/tasks', (req, res) => taskController.criaTask(req, res))
app.get('/tasks/status/:taskStatus', (req, res) => taskController.listaTaskPorStatus(req, res))
app.get('/tasks/:id(//d+)', (req, res) => taskController.obterTaskPorId(req, res))
app.get('/tasks', (req, res) => taskController.listaTask(req, res))
app.put('/tasks/:id/inicia', (req, res) => taskController.iniciarTask(req, res))
app.put('/tasks/:id/conclui', (req, res) => taskController.concluirTask(req, res))
app.put('/tasks/:id/titulo/:titulo', (req, res) => taskController.alterarTituloTask(req, res))
app.put('/tasks/:id/descricao/:descricao', (req, res) =>
  taskController.alterarDescricaoTask(req, res)
)
app.delete('/tasks/:id', (req, res) => taskController.deletarTask(req, res))
app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Servidor rodando na porta 3000')
})

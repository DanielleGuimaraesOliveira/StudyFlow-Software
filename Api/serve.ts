import express from 'express'
import { TaskController } from './src/modulos/Task/TaskController'
import { TaskService } from './src/modulos/Task/TaskService'
import { TaskRepositoryPrisma } from './src/modulos/Task/TaskRepositoryPrisma'

const app = express()

// Parse JSON body
app.use(express.json())

// Simple request/response logging to visualizar POST payload e status

const repository = new TaskRepositoryPrisma()
const service = new TaskService(repository)
const taskController = new TaskController(service)

app.post('/tasks', (req, res) => taskController.criaTask(req, res))

app.listen(3000, () => {})

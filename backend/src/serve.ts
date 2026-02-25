import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { errorHandler } from './shared/http/middlewares/error-middleware'
import taskRouter from './interfaces/http/task/task-router'
import helmet from 'helmet'

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
)

app.use(helmet)

app.use('/tasks', taskRouter)

app.use(errorHandler)

if (require.main === module) {
  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log('Servidor rodando na porta 3000')
  })
}

export default app

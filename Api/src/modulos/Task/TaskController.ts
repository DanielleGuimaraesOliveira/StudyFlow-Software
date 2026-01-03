import { Request, Response } from 'express'
import { CriarTaskDTO, TaskService } from './TaskService'
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  async criaTask(req: Request, res: Response): Promise<void> {
    try {
      const dto: CriarTaskDTO = req.body
      const task = await this.taskService.criarTask(dto)
      res.status(201).json(task)
    } catch (error) {
      const mensagem = (error as Error).message

      if (mensagem.includes('Data final') || mensagem.includes('anterior')) {
        res.status(400).json({ erro: mensagem })
        return
      }

      if (mensagem.includes('Titulo') || mensagem.includes('caracteres')) {
        res.status(400).json({ erro: mensagem })
        return
      }

      // eslint-disable-next-line no-console
      console.error('Erro inesperado:', error)
      res.status(500).json({ erro: 'Erro interno do servidor' })
    }
  }

  async obterTaskPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const task = await this.taskService.obterTaskPorId(id)
      res.status(200).json(task)
    } catch (error) {
      const mensagem = (error as Error).message

      if (mensagem.includes('não encontrada')) {
        res.status(404).json({ erro: mensagem })
        return
      }

      // eslint-disable-next-line no-console
      console.error('Erro inesperado:', error)
      res.status(500).json({ erro: 'Erro interno do servidor' })
    }
  }

  async listaTask(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.listarTasks()
      res.status(200).json(tasks)
    } catch (error) {
      const mensagem = (error as Error).message
    }
  }
}

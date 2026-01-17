import { Request, Response } from 'express'
import { CriarTaskDTO, TaskService } from '../aplicacao/TaskService'
import { TaskStatus } from '../dominio/taskEnums'
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

      res.status(500).json({ erro: 'Erro interno do servidor' })
    }
  }

  async listaTask(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.listarTasks()
      res.status(200).json(tasks)
      return
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao listar tasks:', error)
      res.status(500).json({ erro: 'Erro interno do servidor' })
      return
    }
  }

  async listaTaskPorStatus(req: Request, res: Response): Promise<void> {
    try {
      const statusDaTask = req.params.taskStatus as TaskStatus
      const listaDeTasks = await this.taskService.listarTasksPorStatus(statusDaTask)
      res.status(200).json(listaDeTasks)
      return
    } catch {
      res.status(500).json({ erro: 'Erro interno do servidor' })
    }
  }

  async iniciarTask(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const task = await this.taskService.iniciarTask(id)
      res.status(200).json(task)
      return
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao iniciar task:', error)
      const mensagem = (error as Error).message

      if (mensagem.includes('não encontrada')) {
        res.status(404).json({ erro: mensagem })
        return
      }
      if (mensagem.includes('tarefas pendentes')) {
        res.status(422).json({ erro: mensagem })
        return
      }
      res.status(500).json({ erro: 'Erro interno do servidor' })
    }
  }

  async concluirTask(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const task = await this.taskService.concluirTask(id)
      res.status(200).json(task)
      return
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao concluir task:', error)
      const mensagem = (error as Error).message

      if (mensagem.includes('não encontrada')) {
        res.status(404).json({ erro: mensagem })
        return
      }
      if (mensagem.includes('tarefas em andamento')) {
        res.status(422).json({ erro: mensagem })
        return
      }
      res.status(500).json({ erro: 'Erro interno do servidor' })
    }
  }

  async alterarTituloTask(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const titulo = req.params.titulo
      const task = await this.taskService.alterarTituloTask(id, titulo)
      res.status(200).json(task)
      return
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao alterar título:', error)
      const mensagem = (error as Error).message

      if (mensagem.includes('não encontrada')) {
        res.status(404).json({ erro: mensagem })
        return
      }

      if (mensagem.includes('obrigatório') || mensagem.includes('tem que ter')) {
        res.status(422).json({ erro: mensagem })
        return
      }

      res.status(500).json({ erro: 'Erro interno do servidor' })
      return
    }
  }

  async alterarDescricaoTask(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const descricao = req.params.descricao
      const task = await this.taskService.alterarDescricaoTask(id, descricao)
      res.status(200).json(task)
      return
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao alterar descrição:', error)
      const mensagem = (error as Error).message

      if (mensagem.includes('não encontrada')) {
        res.status(404).json({ erro: mensagem })
        return
      }

      res.status(500).json({ erro: 'Erro interno do servidor' })
    }
  }

  async deletarTask(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      await this.taskService.deletarTask(id)
      res.status(200).json('Task deletada com sucesso')
      return
    } catch (error) {
      const mensagem = (error as Error).message
      if (mensagem.includes('não encontrada')) {
        res.status(404).json({ erro: mensagem })
        return
      }
      res.status(500).json({ erro: 'Erro interno do servidor' })
    }
  }
}

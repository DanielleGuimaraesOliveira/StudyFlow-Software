import { TaskService } from './TaskService'
import { Request, Response } from 'express'
import { TaskController } from './TaskController'
import { Task } from '../../../../Shared/Dominio/Task/taskEntity'
import { TaskStatus } from '../../../../Shared/Dominio/Task/taskEnums'

describe('TaskController', () => {
  const criaTask = (id: number, taskStatus: TaskStatus = TaskStatus.Pendente) =>
    new Task({ id, taskStatus, titulo: 'Teste', descricao: 'Desc' }) as Task

  let taskServiceMock: jest.Mocked<TaskService>
  let taskController: TaskController
  let resMock: Partial<Response>
  let reqMock: Partial<Request & { params: { id?: string } }>

  beforeEach(() => {
    taskServiceMock = {
      criarTask: jest.fn(),
      obterTaskPorId: jest.fn(),
      listarTasks: jest.fn(),
      listarTasksPorStatus: jest.fn(),
      iniciarTask: jest.fn(),
      concluirTask: jest.fn(),
      alterarTituloTask: jest.fn(),
      alterarDescricaoTask: jest.fn(),
      deletarTask: jest.fn(),
    } as unknown as jest.Mocked<TaskService>

    resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    }

    reqMock = {
      body: {},
      params: {},
    }

    taskController = new TaskController(taskServiceMock)
  })

  describe('CriarTask', () => {
    it('Deve criar uma task com sucesso', async () => {
      const taskDTO = {
        id: 1,
        titulo: 'Nova Task',
        descricao: 'Noca descricao',
      }
      reqMock.body = taskDTO

      const taskCriada = criaTask(1)

      taskServiceMock.criarTask.mockResolvedValue(taskCriada)

      await taskController.criaTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(201)
      expect(resMock.json).toHaveBeenLastCalledWith(taskCriada)
    })

    it('Deve lançar um erro ao criar uma task sem titulo', async () => {
      taskServiceMock.criarTask.mockRejectedValue(new Error('Titulo da Task é obrigatório'))

      reqMock.body = { descricao: 'Descricao' }

      await taskController.criaTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(400)
      expect(resMock.json).toHaveBeenCalledWith({
        erro: 'Titulo da Task é obrigatório',
      })
    })

    it('Deve lançar um erro ao criar uma task com menos de 3 caracteres', async () => {
      taskServiceMock.criarTask.mockRejectedValue(
        new Error('Titulo tem que ter no minimo 3 caracteres')
      )

      reqMock.body = { titulo: '1a', descricao: 'descricao' }

      await taskController.criaTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(400)
      expect(resMock.json).toHaveBeenCalledWith({
        erro: 'Titulo tem que ter no minimo 3 caracteres',
      })
    })
  })

  describe('ObterTaskPorId', () => {
    it('Deve obter uma task por id com sucesso', async () => {
      const taskCriada = criaTask(1)
      taskServiceMock.obterTaskPorId.mockResolvedValue(taskCriada)

      reqMock.params = { id: '1' }

      await taskController.obterTaskPorId(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(200)
      expect(resMock.json).toHaveBeenCalledWith(taskCriada)
    })

    it('Deve retornar um erro ao não encontrar uma task por id', async () => {
      taskServiceMock.obterTaskPorId.mockRejectedValue(new Error('Task com ID 1 não encontrada'))
      reqMock.params = { id: '1' }

      await taskController.obterTaskPorId(reqMock as Request, resMock as Response)
      expect(resMock.status).toHaveBeenCalledWith(404)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Task com ID 1 não encontrada' })
    })

    it('Deve o ocorrer um erro inesperado ao obter task por id', async () => {
      taskServiceMock.obterTaskPorId.mockRejectedValue(
        new Error('Falha na conexão com o Banco de dados')
      )
      reqMock.params = { id: '3' }

      await taskController.obterTaskPorId(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(500)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' })
    })
  })

  describe('ListarTasks', () => {
    it('Deve listar tasks corretamente', async () => {
      const taskCriadas = [criaTask(1), criaTask(2)]
      taskServiceMock.listarTasks.mockResolvedValue(taskCriadas)

      await taskController.listaTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(200)
      expect(resMock.json).toHaveBeenCalledWith(taskCriadas)
      expect(resMock.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 1 }),
          expect.objectContaining({ id: 2 }),
        ])
      )
    })

    it('Deve o ocorrer um erro inesperado ao listar tasks', async () => {
      taskServiceMock.listarTasks.mockRejectedValue(
        new Error('Falha na conexão com o Banco de dados')
      )

      await taskController.listaTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(500)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' })
    })
  })

  describe('ListarTasksPorStatus', () => {
    it('Deve listar tasks Por status corretamente', async () => {
      const taskCriadas = [criaTask(1, TaskStatus.Concluida), criaTask(2, TaskStatus.Pendente)]
      taskServiceMock.listarTasksPorStatus.mockResolvedValue(taskCriadas)

      await taskController.listaTaskPorStatus(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(200)
      expect(resMock.json).toHaveBeenCalledWith(taskCriadas)
      expect(resMock.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ taskStatus: TaskStatus.Concluida }),
          expect.objectContaining({ taskStatus: TaskStatus.Pendente }),
        ])
      )
    })

    it('Deve o ocorrer um erro inesperado ao listar tasks por status', async () => {
      taskServiceMock.listarTasksPorStatus.mockRejectedValue(
        new Error('Falha na conexão com o Banco de dados')
      )

      await taskController.listaTaskPorStatus(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(500)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' })
    })
  })

  describe('iniciarTask', () => {
    it('Deve iniciar uma task corretamente', async () => {
      const taskCriada = criaTask(1, TaskStatus.EmAndamento)
      taskServiceMock.iniciarTask.mockResolvedValue(taskCriada)
      reqMock.params = { id: '1', taskStatus: TaskStatus.Pendente }

      await taskController.iniciarTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(200)
      expect(resMock.json).toHaveBeenCalledWith(taskCriada)
      expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining({'taskStatus': 'Em Andamento'}))
    })

    it('Deve retornar erro ao tentar iniciar task inexistente', async () => {
      taskServiceMock.iniciarTask.mockRejectedValue(new Error('Task com ID 1 não encontrada'))
      reqMock.params = { id: '1' }

      await taskController.iniciarTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(404)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Task com ID 1 não encontrada' })
    })

    it('Deve retornar erro ao tentar iniciar task com status incorreto', async () => {
      taskServiceMock.iniciarTask.mockRejectedValue(
        new Error('Apenas tarefas pendentes podem ser iniciadas')
      )
      reqMock.params = { id: '1' }

      await taskController.iniciarTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(422)
      expect(resMock.json).toHaveBeenCalledWith({
        erro: 'Apenas tarefas pendentes podem ser iniciadas',
      })
    })

    it('Deve ocorrer um erro inesperado ao iniciar a task', async () => {
      taskServiceMock.iniciarTask.mockRejectedValue(
        new Error('Falha na conexão com o Banco de dados')
      )
      reqMock.params = { id: '1' }

      await taskController.iniciarTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(500)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' })
    })
  })

  describe('concluirTask', () => {
    it('Deve concluir uma task corretamente', async () => {
      const taskCriada = criaTask(1, TaskStatus.Concluida)
      taskServiceMock.concluirTask.mockResolvedValue(taskCriada)
      reqMock.params = { id: '1' }

      await taskController.concluirTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(200)
      expect(resMock.json).toHaveBeenCalledWith(taskCriada)
      expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining({taskStatus: TaskStatus.Concluida}))
    })

    it('Deve retornar erro ao tentar concluir task inexistente', async () => {
      taskServiceMock.concluirTask.mockRejectedValue(new Error('Task com ID 1 não encontrada'))
      reqMock.params = { id: '1' }

      await taskController.concluirTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(404)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Task com ID 1 não encontrada' })
    })

    it('Deve retornar erro ao tentar concluir task com status incorreto', async () => {
      taskServiceMock.concluirTask.mockRejectedValue(
        new Error('Apenas tarefas em andamento podem ser concluidas')
      )
      reqMock.params = { id: '1' }

      await taskController.concluirTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(422)
      expect(resMock.json).toHaveBeenCalledWith({
        erro: 'Apenas tarefas em andamento podem ser concluidas',
      })
    })

    it('Deve ocorrer um erro inesperado ao concluir a task', async () => {
      taskServiceMock.concluirTask.mockRejectedValue(
        new Error('Falha na conexão com o Banco de dados')
      )
      reqMock.params = { id: '1' }

      await taskController.concluirTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(500)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' })
    })
  })
})

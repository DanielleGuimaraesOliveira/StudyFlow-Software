import { TaskService } from './TaskService'
import { Request, Response } from 'express'
import { TaskController } from './TaskController'
import { Task } from '../../../../Shared/Dominio/Task/task'
import { TaskStatus } from '../../../../Shared/Dominio/Task/taskEnums'

describe('TaskController', () => {
  const criaTask = (id: number, taskStatus: TaskStatus = TaskStatus.Pendente) =>
    new Task({ id, taskStatus, titulo: 'Teste', descricao: 'Desc' }) as Task

  let taskServiceMock: jest.Mocked<TaskService>
  let taskController: TaskController
  let resMock: Partial<Response>
  let reqMock: Partial<Request>

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
        new Error('Titulo tem que ter no minimo 3 caracteres e no máximo 100 ')
      )

      reqMock.body = { titulo: '1a', descricao: 'descricao' }

      await taskController.criaTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(400)
      expect(resMock.json).toHaveBeenCalledWith({
        erro: 'Titulo tem que ter no minimo 3 caracteres e no máximo 100 ',
      })
    })
  })
})

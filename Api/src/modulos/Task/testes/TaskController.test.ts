import { TaskService } from '../aplicacao/TaskService'
import { Request, Response } from 'express'
import { TaskController } from '../http/TaskController'
import { Task } from '../dominio/taskEntity'
import { TaskStatus } from '../dominio/taskEnums'
import { ErroDominio, ErroNaoEncontrado, ErroValidacao } from '../../../Shared/erros/erros'

describe('TaskController', () => {
  const criaTask = (
    id: number,
    status: TaskStatus = TaskStatus.Pendente,
    titulo: string = 'Teste',
    descricao: string = 'Desc'
  ) => new Task({ id, titulo, descricao, taskStatus: status })

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
      taskServiceMock.criarTask.mockRejectedValue(new ErroValidacao('Titulo da Task é obrigatório'))

      reqMock.body = { descricao: 'Descricao' }

      await taskController.criaTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(400)
      expect(resMock.json).toHaveBeenCalledWith({
        erro: 'Titulo da Task é obrigatório',
      })
    })

    it('Deve lançar um erro ao criar uma task com menos de 3 caracteres', async () => {
      taskServiceMock.criarTask.mockRejectedValue(
        new ErroDominio('Titulo tem que ter no minimo 3 caracteres')
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
      taskServiceMock.obterTaskPorId.mockRejectedValue(
        new ErroNaoEncontrado('Task com ID 1 não encontrada')
      )
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
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({ taskStatus: 'Em Andamento' })
      )
    })

    it('Deve retornar erro ao tentar iniciar task inexistente', async () => {
      taskServiceMock.iniciarTask.mockRejectedValue(
        new ErroNaoEncontrado('Task com ID 1 não encontrada')
      )
      reqMock.params = { id: '1' }

      await taskController.iniciarTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(404)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Task com ID 1 não encontrada' })
    })

    it('Deve retornar erro ao tentar iniciar task com status incorreto', async () => {
      taskServiceMock.iniciarTask.mockRejectedValue(
        new ErroDominio('Apenas tarefas pendentes podem ser iniciadas')
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
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({ taskStatus: TaskStatus.Concluida })
      )
    })

    it('Deve retornar erro ao tentar concluir task inexistente', async () => {
      taskServiceMock.concluirTask.mockRejectedValue(
        new ErroNaoEncontrado('Task com ID 1 não encontrada')
      )
      reqMock.params = { id: '1' }

      await taskController.concluirTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(404)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Task com ID 1 não encontrada' })
    })

    it('Deve retornar erro ao tentar concluir task com status incorreto', async () => {
      taskServiceMock.concluirTask.mockRejectedValue(
        new ErroDominio('Apenas tarefas em andamento podem ser concluidas')
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

  describe('alteraTituloTask', () => {
    it('Deve alterar o titulo coretamente', async () => {
      const taskCriada = criaTask(1, TaskStatus.Pendente, 'novoTitulo')
      taskServiceMock.alterarTituloTask.mockResolvedValue(taskCriada)

      reqMock.params = { id: '1', titulo: 'novoTitulo' }

      await taskController.alterarTituloTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(200)
      expect(resMock.json).toHaveBeenCalledWith(taskCriada)
      expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining({ titulo: 'novoTitulo' }))
    })

    it('Deve retornar erro ao tentar alterar o titulo de uma task inexistente', async () => {
      taskServiceMock.alterarTituloTask.mockRejectedValue(
        new ErroNaoEncontrado('Task com ID 1 não encontrada')
      )
      reqMock.params = { id: '1' }

      await taskController.alterarTituloTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(404)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Task com ID 1 não encontrada' })
    })

    it('Deve retornar erro ao tentar alterar para um titulo vazio', async () => {
      taskServiceMock.alterarTituloTask.mockRejectedValue(new ErroDominio('Titulo é obrigatório'))
      reqMock.params = { id: '1', titulo: '' }

      await taskController.alterarTituloTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(422)
      expect(resMock.json).toHaveBeenCalledWith({
        erro: 'Titulo é obrigatório',
      })
    })

    it('Deve ocorrer um erro inesperado ao alterar o titulo', async () => {
      taskServiceMock.alterarTituloTask.mockRejectedValue(
        new Error('Falha na conexão com o Banco de dados')
      )
      reqMock.params = { id: '1' }

      await taskController.alterarTituloTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(500)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' })
    })
  })

  describe('alteraDescricaoTask', () => {
    it('Deve alterar a descricao coretamente', async () => {
      const taskCriada = criaTask(1, TaskStatus.Pendente, 'titulo', 'novaDescricao')
      taskServiceMock.alterarDescricaoTask.mockResolvedValue(taskCriada)

      reqMock.params = { id: '1', descricao: 'novaDescricao' }

      await taskController.alterarDescricaoTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(200)
      expect(resMock.json).toHaveBeenCalledWith(taskCriada)
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({ descricao: 'novaDescricao' })
      )
    })

    it('Deve retornar erro ao tentar alterar o titulo de uma task inexistente', async () => {
      taskServiceMock.alterarDescricaoTask.mockRejectedValue(
        new ErroNaoEncontrado('Task com ID 1 não encontrada')
      )
      reqMock.params = { id: '1', descricao: 'novaDescricao' }

      await taskController.alterarDescricaoTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(404)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Task com ID 1 não encontrada' })
    })

    it('Deve ocorrer um erro inesperado ao alterar o titulo', async () => {
      taskServiceMock.alterarDescricaoTask.mockRejectedValue(
        new Error('Falha na conexão com o Banco de dados')
      )
      reqMock.params = { id: '1', descricao: 'Desc ' }

      await taskController.alterarDescricaoTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(500)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' })
    })
  })

  describe('deletaTask', () => {
    it('Deve deletar uma task coretamente', async () => {
      taskServiceMock.deletarTask.mockResolvedValue(undefined)

      reqMock.params = { id: '1' }

      await taskController.deletarTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(200)
      expect(resMock.json).toHaveBeenCalledWith('Task deletada com sucesso')
    })

    it('Deve retornar erro ao tentar alterar o titulo de uma task inexistente', async () => {
      taskServiceMock.deletarTask.mockRejectedValue(
        new ErroNaoEncontrado('Task com ID 1 não encontrada')
      )
      reqMock.params = { id: '1' }

      await taskController.deletarTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(404)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Task com ID 1 não encontrada' })
    })

    it('Deve ocorrer um erro inesperado ao alterar o titulo', async () => {
      taskServiceMock.deletarTask.mockRejectedValue(
        new Error('Falha na conexão com o Banco de dados')
      )
      reqMock.params = { id: '1' }

      await taskController.deletarTask(reqMock as Request, resMock as Response)

      expect(resMock.status).toHaveBeenCalledWith(500)
      expect(resMock.json).toHaveBeenCalledWith({ erro: 'Erro interno do servidor' })
    })
  })
})

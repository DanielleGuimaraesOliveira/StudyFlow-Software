import { TaskRepository, TaskService } from './TaskService'
import { Task } from '../../../Shared/Dominio/Task/task'
import { TaskPrioridade, TaskStatus } from '../../../Shared/Dominio/Task/taskEnums'

describe('TaskService', () => {
  const criaTask = (id: number) => new Task({ id, titulo: 'Teste', descricao: 'Desc' })
  let taskService: TaskService
  let taskRepositoryMock: jest.Mocked<TaskRepository>

  beforeEach(() => {
    taskRepositoryMock = {
      criar: jest.fn(),
      buscarPorId: jest.fn(),
      listarTodas: jest.fn(),
      listarPorStatus: jest.fn(),
      atualizar: jest.fn(),
      deletar: jest.fn(),
    }

    taskService = new TaskService(taskRepositoryMock)
  })

  it('Deve Criar uma task e delegar ao repository', async () => {
    const taskCriada = criaTask(1)

    taskRepositoryMock.criar.mockResolvedValue(taskCriada)
    const resultado = await taskService.criarTask({ titulo: 'Teste', descricao: 'Desc' })

    expect(resultado).toBe(taskCriada)
    expect(taskRepositoryMock.criar).toHaveBeenCalledWith(expect.any(Task))
  })

  it('Deve obter uma task por id quando existit', async () => {
    const taskCriada = criaTask(2)

    taskRepositoryMock.buscarPorId.mockResolvedValue(taskCriada)
    const resultado = await taskService.obterTaskPorId(2)
    expect(resultado).toEqual(taskCriada)
    expect(taskRepositoryMock.buscarPorId).toHaveBeenCalledWith(2)
  })

  it('Deve retorna um erro o id não é encontrado em obter task por id', async () => {
    taskRepositoryMock.buscarPorId.mockResolvedValue(null)

    await expect(taskService.obterTaskPorId(2)).rejects.toThrow('Task com ID 2 não encontrada')
  })

  it('Deve retornar uma lista de Tasks', async () => {
    const listaTask = [criaTask(1)]
    taskRepositoryMock.listarTodas.mockResolvedValue(listaTask)
    const resultado = await taskService.listarTasks()

    expect(taskRepositoryMock.listarTodas).toHaveBeenCalledTimes(1)
    expect(resultado).toEqual(listaTask)
  })
})

import { TaskRepository, TaskService } from './TaskService'
import { Task } from '../../../Shared/Dominio/Task/task'
import { TaskPrioridade, TaskStatus } from '../../../Shared/Dominio/Task/taskEnums'

describe('TaskService', () => {
  const criaTask = (id: number, status: TaskStatus = TaskStatus.Pendente) =>
    new Task({ id, titulo: 'Teste', descricao: 'Desc', taskStatus: status })
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

  it('Deve retornar uma listar com base no status da tarefa', async () => {
    const listaTaskPendente = [criaTask(1), criaTask(2)]
    taskRepositoryMock.listarPorStatus.mockResolvedValue(listaTaskPendente)

    const resultado = await taskService.listarTasksPorStatus(TaskStatus.Pendente)

    expect(taskRepositoryMock.listarPorStatus).toHaveBeenCalledWith(TaskStatus.Pendente)
    expect(resultado).toBe(listaTaskPendente)
  })

  it('Deve iniciar uma task corretamente', async () => {
    const taskCriada = criaTask(1)

    taskRepositoryMock.buscarPorId.mockResolvedValue(taskCriada)
    taskRepositoryMock.atualizar.mockResolvedValue()

    await taskService.iniciarTask(1)

    expect(taskRepositoryMock.buscarPorId).toHaveBeenCalledWith(1)

    expect(taskRepositoryMock.atualizar).toHaveBeenCalledWith(
      expect.objectContaining({
        getTaskStatus: expect.any(Function),
      })
    )
    const taskAtualizada = taskRepositoryMock.atualizar.mock.calls[0][0] as Task
    expect(taskAtualizada.getTaskStatus()).toBe(TaskStatus.EmAndamento)
  })

  it('Deve da erro ao iniciar uma tarefa por id nao achado', async () => {
    taskRepositoryMock.buscarPorId.mockResolvedValue(null)
    await expect(taskService.iniciarTask(1)).rejects.toThrow('Task com ID 1 não encontrada')
    expect(taskRepositoryMock.atualizar).not.toHaveBeenCalled()
  })

  it('Deve propagar erro no metodo iniciar task ao falhar ao atualizar uma task', async () => {
    const taskCriada = criaTask(1)
    taskRepositoryMock.buscarPorId.mockResolvedValue(taskCriada)
    taskRepositoryMock.atualizar.mockRejectedValue(new Error('Falha ao atualizar'))

    await expect(taskService.iniciarTask(1)).rejects.toThrow('Falha ao atualizar')
    expect(taskRepositoryMock.buscarPorId).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.atualizar).toHaveBeenCalledWith(taskCriada)
  })

  it('Deve concluir uma tarefa e atualizar ela corretamente', async () => {
    const taskCriada = criaTask(1, TaskStatus.EmAndamento)
    taskRepositoryMock.buscarPorId.mockResolvedValue(taskCriada)
    taskRepositoryMock.atualizar.mockResolvedValue()

    await taskService.concluirTask(1)

    expect(taskRepositoryMock.buscarPorId).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.atualizar).toHaveBeenCalledWith(
      expect.objectContaining({ getTaskStatus: expect.any(Function) })
    )
    const taskAtualizada = taskRepositoryMock.atualizar.mock.calls[0][0] as Task
    expect(taskAtualizada.getTaskStatus()).toBe(TaskStatus.Concluida)
  })

  it('Deve da erro ao concluir uma task por id nao achado', async () => {
    taskRepositoryMock.buscarPorId.mockResolvedValue(null)
    await expect(taskService.concluirTask(1)).rejects.toThrow('Task com ID 1 não encontrada')
    expect(taskRepositoryMock.atualizar).not.toHaveBeenCalled()
  })

  it('Deve propagar erro no metodo concluir uma task ao falhar em atualizar uma task', async () => {
    const taskCriada = criaTask(1, TaskStatus.EmAndamento)
    taskRepositoryMock.buscarPorId.mockResolvedValue(taskCriada)
    taskRepositoryMock.atualizar.mockRejectedValue(new Error('Falha ao atualizar'))

    await expect(taskService.concluirTask(1)).rejects.toThrow('Falha ao atualizar')
    expect(taskRepositoryMock.buscarPorId).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.atualizar).toHaveBeenCalledWith(taskCriada)
  })

  it('Deve alterar o titulo de uma task corretamente', async () => {
    const taskCriada = criaTask(1)
    taskRepositoryMock.buscarPorId.mockResolvedValue(taskCriada)
    taskRepositoryMock.atualizar.mockResolvedValue()

    await taskService.alterarTituloTask(1, 'novoTitulo')

    expect(taskRepositoryMock.buscarPorId).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.atualizar).toHaveBeenCalledWith(
      expect.objectContaining({ alteraTituloTask: expect.any(Function) })
    )

    const taskAtualizada = taskRepositoryMock.atualizar.mock.calls[0][0] as Task
    expect(taskAtualizada.getTitulo()).toBe('novoTitulo')
  })

  it('Deve da erro ao alterar uma titulo por causa de id nao achado', async () => {
    taskRepositoryMock.buscarPorId.mockResolvedValue(null)
    await expect(taskService.alterarTituloTask(1, 'novoTitulo')).rejects.toThrow(
      'Task com ID 1 não encontrada'
    )
    expect(taskRepositoryMock.atualizar).not.toHaveBeenCalled()
  })

  it('Deve propagar erro no metodo alterar titulo de uma task ao falhar em atualizar uma task', async () => {
    const taskCriada = criaTask(1)
    taskRepositoryMock.buscarPorId.mockResolvedValue(taskCriada)
    taskRepositoryMock.atualizar.mockRejectedValue(new Error('Falha ao atualizar'))

    await expect(taskService.alterarTituloTask(1, 'novoTitulo')).rejects.toThrow(
      'Falha ao atualizar'
    )
    expect(taskRepositoryMock.buscarPorId).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.atualizar).toHaveBeenCalledWith(taskCriada)
  })

  it('Deve alterar a descrição de uma task corretamente', async () => {
    const taskCriada = criaTask(1)
    taskRepositoryMock.buscarPorId.mockResolvedValue(taskCriada)
    taskRepositoryMock.atualizar.mockResolvedValue()

    await taskService.alterarDescricaoTask(1, 'novaDescrição')

    expect(taskRepositoryMock.buscarPorId).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.atualizar).toHaveBeenCalledWith(
      expect.objectContaining({ alteraDescricaoTask: expect.any(Function) })
    )

    const taskAtualizada = taskRepositoryMock.atualizar.mock.calls[0][0] as Task
    expect(taskAtualizada.getDescricao()).toBe('novaDescrição')
  })

  it('Deve da erro ao alterar uma descrição por causa de id nao achado', async () => {
    taskRepositoryMock.buscarPorId.mockResolvedValue(null)
    await expect(taskService.alterarDescricaoTask(1, 'novaDescricao')).rejects.toThrow(
      'Task com ID 1 não encontrada'
    )
    expect(taskRepositoryMock.atualizar).not.toHaveBeenCalled()
  })

  it('Deve propagar erro no metodo alterar descricao de uma task ao falhar em atualizar uma task', async () => {
    const taskCriada = criaTask(1)
    taskRepositoryMock.buscarPorId.mockResolvedValue(taskCriada)
    taskRepositoryMock.atualizar.mockRejectedValue(new Error('Falha ao atualizar'))

    await expect(taskService.alterarDescricaoTask(1, 'nova Descricao')).rejects.toThrow(
      'Falha ao atualizar'
    )
    expect(taskRepositoryMock.buscarPorId).toHaveBeenCalledWith(1)
    expect(taskRepositoryMock.atualizar).toHaveBeenCalledWith(taskCriada)
  })

  it('Deve deletar uma task corretamente', async () => {
    taskRepositoryMock.deletar.mockResolvedValue()
    await taskService.deletarTask(1)

    expect(taskRepositoryMock.deletar).toHaveBeenCalledWith(1)
  })

  it('Deve dar erro ao uma task', async () => {
    taskRepositoryMock.deletar.mockRejectedValue(new Error('Falha ao deletar Task'))
    await expect(taskService.deletarTask(1)).rejects.toThrow('Falha ao deletar Task')

    expect(taskRepositoryMock.deletar).toHaveBeenCalledWith(1)
  })
})

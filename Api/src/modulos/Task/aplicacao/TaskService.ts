import { ErroNaoEncontrado } from '../../../Shared/erros/erros'
import { Task } from '../dominio/taskEntity'
import { TaskPrioridade, TaskStatus } from '../dominio/taskEnums'

export interface CriarTaskDTO {
  titulo: string
  descricao?: string
  taskStatus?: TaskStatus
  taskPrioridade?: TaskPrioridade
  dataCriacao?: Date
  dataFinal?: Date
}

export interface TaskRepository {
  criar(task: Task): Promise<Task>
  buscarPorId(id: number): Promise<Task | null>
  listarTodas(): Promise<Task[]>
  listarPorStatus(status: TaskStatus): Promise<Task[]>
  atualizar(task: Task): Promise<Task>
  deletar(id: number): Promise<void>
}

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async criarTask(dto: CriarTaskDTO): Promise<Task> {
    const task = new Task({
      id: 0,
      titulo: dto.titulo,
      descricao: dto.descricao,
      taskStatus: dto.taskStatus,
      taskPrioridade: dto.taskPrioridade,
      dataCriacao: dto.dataCriacao,
      dataFinal: dto.dataFinal,
    })
    return this.taskRepository.criar(task)
  }

  async obterTaskPorId(id: number): Promise<Task> {
    const task = await this.taskRepository.buscarPorId(id)
    if (!task) throw new ErroNaoEncontrado(`Task com ID ${id} não encontrada`)
    return task
  }

  async listarTasks(): Promise<Task[]> {
    return this.taskRepository.listarTodas()
  }

  async listarTasksPorStatus(status: TaskStatus): Promise<Task[]> {
    return this.taskRepository.listarPorStatus(status)
  }

  async iniciarTask(id: number): Promise<Task> {
    const task = await this.obterTaskPorId(id)
    if (!task) throw new ErroNaoEncontrado(`Task com ID ${id} não encontrada`)

    task.setStatusEmAndamento()
    return await this.taskRepository.atualizar(task)
  }

  async concluirTask(id: number): Promise<Task> {
    const task = await this.obterTaskPorId(id)
    if (!task) throw new ErroNaoEncontrado(`Task com ID ${id} não encontrada`)
    task.setStatusConcluido()
    return await this.taskRepository.atualizar(task)
  }

  async alterarTituloTask(id: number, novoTitulo: string): Promise<Task> {
    const task = await this.obterTaskPorId(id)
    if (!task) throw new ErroNaoEncontrado(`Task com ID ${id} não encontrada`)
    task.alteraTituloTask(novoTitulo)
    return await this.taskRepository.atualizar(task)
  }

  async alterarDescricaoTask(id: number, novaDescricao: string): Promise<Task> {
    const task = await this.obterTaskPorId(id)
    task.alteraDescricaoTask(novaDescricao)
    return await this.taskRepository.atualizar(task)
  }

  async deletarTask(id: number): Promise<void> {
    const task = await this.obterTaskPorId(id)
    if (!task) throw new ErroNaoEncontrado(`Task com ID ${id} não encontrada`)
    await this.taskRepository.deletar(id)
  }
}

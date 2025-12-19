import { Task } from '../../../Shared/Dominio/Task/task'
import { TaskPrioridade, TaskStatus } from '../../../Shared/Dominio/Task/taskEnums'

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
  atualizar(task: Task): Promise<void>
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
    if (!task) throw new Error(`Task com ID ${id} não encontrada`)
    return task
  }

  async listarTasks(): Promise<Task[]> {
    return this.taskRepository.listarTodas()
  }

  async listarTasksPorStatus(status: TaskStatus): Promise<Task[]> {
    return this.taskRepository.listarPorStatus(status)
  }

  async iniciarTask(id: number): Promise<void> {
    const task = await this.obterTaskPorId(id)
    task.setStatusEmAndamento()
    await this.taskRepository.atualizar(task)
  }

  async concluirTask(id: number): Promise<void> {
    const task = await this.obterTaskPorId(id)
    task.setStatusConcluido()
    await this.taskRepository.atualizar(task)
  }

  async alterarTituloTask(id: number, novoTitulo: string): Promise<void> {
    const task = await this.obterTaskPorId(id)
    task.alteraTituloTask(novoTitulo)
    await this.taskRepository.atualizar(task)
  }

  async alterarDescricaoTask(id: number, novaDescricao: string): Promise<void> {
    const task = await this.obterTaskPorId(id)
    task.alteraDescricaoTask(novaDescricao)
    await this.taskRepository.atualizar(task)
  }

  async deletarTask(id: number): Promise<void> {
    await this.taskRepository.deletar(id)
  }
}

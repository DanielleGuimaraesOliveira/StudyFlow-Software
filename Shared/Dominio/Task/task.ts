import { TaskStatus, TaskPrioridade } from './taskEnums'
export interface TaskPropriedades {
  id: number
  titulo: string
  descricao: string
  taskStatus?: TaskStatus
  taskPrioridade?: TaskPrioridade
  dataCriacao?: Date
  dataFinal?: Date
}

export class Task {
  private id: number
  private titulo: string
  private descricao: string
  private taskStatus: TaskStatus
  private taskPrioridade: TaskPrioridade
  private dataCriacao: Date
  private dataFinal: Date

  constructor(props: TaskPropriedades) {
    this.id = props.id
    this.titulo = props.titulo
    this.descricao = props.descricao
    this.taskStatus = props.taskStatus ?? TaskStatus.Pendente
    this.taskPrioridade = props.taskPrioridade ?? TaskPrioridade.SemPrioridade
    this.dataCriacao = props.dataCriacao ?? new Date()
    this.dataFinal = props.dataFinal ?? new Date()
  }

  public getId(): number {
    return this.id
  }

  public getTitulo(): string {
    return this.titulo
  }

  public getDescricao(): string {
    return this.descricao
  }

  public getTaskStatus(): TaskStatus {
    return this.taskStatus
  }

  public getTaskPrioridade(): TaskPrioridade {
    return this.taskPrioridade
  }

  public getDataCriacao(): Date {
    return this.dataCriacao
  }

  public getDataFinal(): Date {
    return this.dataFinal
  }

  public setStatusEmAndamento(): void {
    if (this.taskStatus != TaskStatus.Pendente) {
      throw new Error('Apenas tarefas pendentes podem ser iniciadas')
    }

    this.taskStatus = TaskStatus.EmAndamento
  }

  public setStatusConcluido(): void {
    if (this.taskStatus != TaskStatus.EmAndamento) {
      throw new Error('Apenas tarefas em andamento podem ser concluidas')
    }

    this.taskStatus = TaskStatus.Concluida
  }

  public alteraTituloTask(novoTitulo: string): void {
    if (novoTitulo.length < 3) {
      throw new Error('Apenas titulos com mais de 3 letras podem ser criados')
    }

    this.titulo = novoTitulo
  }
}

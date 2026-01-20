import { TaskStatus, TaskPrioridade } from './taskEnums'
import { ErroDominio, ErroValidacao } from '../../../Shared/erros/erros'
export interface TaskPropriedades {
  id: number
  titulo: string
  descricao?: string
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
    this.titulo = props.titulo.trim()
    this.descricao = props.descricao?.trim() ?? ''
    this.taskStatus = props.taskStatus ?? TaskStatus.Pendente
    this.taskPrioridade = props.taskPrioridade ?? TaskPrioridade.SemPrioridade
    this.dataCriacao = props.dataCriacao ?? new Date()
    this.dataFinal = props.dataFinal ?? new Date()
    if (!props.titulo || props.titulo.trim() == '') {
      throw new ErroValidacao('Titulo é obrigatório')
    }

    if (props.titulo.length < 3) {
      throw new ErroDominio('Titulo tem que ter no minimo 3 caracteres')
    }

    if (props.titulo.length > 100) {
      throw new ErroDominio('Titulo tem que ter no máximo 100 caracteres')
    }

    if (this.dataFinal < this.dataCriacao) {
      throw new ErroDominio('Data final não pode ser anterior à data de criação')
    }
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
      throw new ErroDominio('Apenas tarefas pendentes podem ser iniciadas')
    }

    this.taskStatus = TaskStatus.EmAndamento
  }

  public setStatusConcluido(): void {
    if (this.taskStatus != TaskStatus.EmAndamento) {
      throw new ErroDominio('Apenas tarefas em andamento podem ser concluidas')
    }

    this.taskStatus = TaskStatus.Concluida
  }

  public alteraTituloTask(novoTitulo: string): void {
    if (!novoTitulo.trim()) {
      throw new ErroValidacao('Titulo é obrigatório')
    }
    if (novoTitulo.trim().length < 3) {
      throw new ErroDominio('Titulo tem que ter pelo menos 3 caracteres')
    }

    if (novoTitulo.trim().length > 100) {
      throw new ErroDominio('Titulo tem que ter no máximo 100 caracteres')
    }

    this.titulo = novoTitulo.trim()
  }

  public alteraDescricaoTask(novaDescricao: string): void {
    this.descricao = novaDescricao?.trim() ?? ''
  }
}

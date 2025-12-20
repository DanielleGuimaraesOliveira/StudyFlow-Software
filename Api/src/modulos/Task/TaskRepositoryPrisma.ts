// Api/Repositories/TaskRepositoryPrisma.ts
import { PrismaClient, Task as PrismaTask } from '@prisma/client'
import { Task } from '../../../../Shared/Dominio/Task/task'
import { TaskPrioridade, TaskStatus } from '../../../../Shared/Dominio/Task/taskEnums'
import { TaskRepository } from './TaskService'

export class TaskRepositoryPrisma implements TaskRepository {
  private prisma = new PrismaClient()

  async criar(task: Task): Promise<Task> {
    const created = await this.prisma.task.create({
      data: {
        titulo: task.getTitulo(),
        descricao: task.getDescricao(),
        status: task.getTaskStatus(),
        prioridade: task.getTaskPrioridade(),
        dataCriacao: task.getDataCriacao(),
        dataFinal: task.getDataFinal(),
      },
    })
    return this.toDomain(created)
  }

  async buscarPorId(id: number): Promise<Task | null> {
    const row = await this.prisma.task.findUnique({ where: { id } })
    return row ? this.toDomain(row) : null
  }

  async listarTodas(): Promise<Task[]> {
    const rows = await this.prisma.task.findMany()
    return rows.map((r: PrismaTask) => this.toDomain(r))
  }

  async listarPorStatus(status: TaskStatus): Promise<Task[]> {
    const rows = await this.prisma.task.findMany({
      where: { status },
    })
    return rows.map((r: PrismaTask) => this.toDomain(r))
  }

  async atualizar(task: Task): Promise<void> {
    await this.prisma.task.update({
      where: { id: task.getId() },
      data: {
        titulo: task.getTitulo(),
        descricao: task.getDescricao(),
        status: task.getTaskStatus(),
        prioridade: task.getTaskPrioridade(),
        dataCriacao: task.getDataCriacao(),
        dataFinal: task.getDataFinal(),
      },
    })
  }

  async deletar(id: number): Promise<void> {
    await this.prisma.task.delete({ where: { id } })
  }

  private toDomain(row: PrismaTask): Task {
    return new Task({
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      taskStatus: row.status as TaskStatus,
      taskPrioridade: row.prioridade as TaskPrioridade,
      dataCriacao: row.dataCriacao,
      dataFinal: row.dataFinal,
    })
  }
}

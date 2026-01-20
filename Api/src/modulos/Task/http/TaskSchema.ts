import { z } from 'zod'
import { TaskPrioridade, TaskStatus } from '../dominio/taskEnums'

export const taskIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const taskStatusParamsSchema = z.object({
  taskStatus: z.enum([TaskStatus.Pendente, TaskStatus.EmAndamento, TaskStatus.Concluida]),
})

export const alterarTituloSchema = z.object({
  id: z.coerce.number().int().positive(),
  titulo: z.string(),
})

export const alterarDescricaoSchema = z.object({
  id: z.coerce.number().int().positive(),
  descricao: z.string().min(3).max(500),
})

export const criarTaskSchema = z.object({
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  body: z.object({
    titulo: z.string().min(3).max(100),
    descricao: z.string().min(3).max(500).optional(),
    taskStatus: z
      .enum([TaskStatus.Pendente, TaskStatus.EmAndamento, TaskStatus.Concluida])
      .optional(),
    taskPrioridade: z
      .enum([
        TaskPrioridade.SemPrioridade,
        TaskPrioridade.Baixa,
        TaskPrioridade.Media,
        TaskPrioridade.Alta,
        TaskPrioridade.Urgente,
      ])
      .optional(),
    dataCriacao: z.union([z.string(), z.date()]).pipe(z.coerce.date()).optional(),
    dataFinal: z.union([z.string(), z.date()]).pipe(z.coerce.date()).optional(),
  }),
})

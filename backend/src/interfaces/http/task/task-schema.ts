import { z } from 'zod'
import { TaskPriority, TaskStatus } from '../../../domain/task/task-enums'

export const taskIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const taskStatusParamsSchema = z.object({
  taskStatus: z.enum([TaskStatus.Pending, TaskStatus.InProgress, TaskStatus.Done]),
})

export const changeTitleTaskSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string(),
})

export const changeDescriptionTaskSchema = z.object({
  id: z.coerce.number().int().positive(),
  description: z.string().min(3).max(500),
})

export const criarTaskSchema = z.object({
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  body: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(3).max(500).optional(),
    taskStatus: z.enum([TaskStatus.Pending, TaskStatus.InProgress, TaskStatus.Done]).optional(),
    taskPriority: z
      .enum([
        TaskPriority.None,
        TaskPriority.Low,
        TaskPriority.Medium,
        TaskPriority.High,
        TaskPriority.Urgent,
      ])
      .optional(),
    createAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()).optional(),
    deadline: z.union([z.string(), z.date()]).pipe(z.coerce.date()).optional(),
  }),
})

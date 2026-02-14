import { ZodType } from 'zod'
import { Request, Response, NextFunction } from 'express'

interface ValidatedData {
  params?: Record<string, unknown>
  body?: Record<string, unknown>
  query?: Record<string, unknown>
}

export function validation(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse({
      params: req.params,
      body: req.body,
      query: req.query,
    })

    if (!resultado.success) {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: resultado.error.message,
      })
    }

    const data = resultado.data as ValidatedData
    if (data.body) {
      req.body = data.body
    }
    if (data.params) {
      req.params = data.params as Request['params']
    }
    if (data.query) {
      req.query = data.query as Request['query']
    }
    next()
  }
}

import { ZodType } from 'zod'
import { Request, Response, NextFunction } from 'express'
import { ValidationError } from '../../errors/errors'

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
      throw new ValidationError('Invalid data', 400)
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

import { Request, Response, NextFunction } from 'express'
import { ApplicationError } from '../../errors/errors'
export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  nextFunction: NextFunction
) {
  if (error instanceof ApplicationError) {
    return response.status(error.statusCode).json({ error: error.message })
  }

  return response.status(500).json({ error: 'Internal server error' })
}

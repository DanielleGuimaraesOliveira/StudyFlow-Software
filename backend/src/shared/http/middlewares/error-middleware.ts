import { Request, Response, NextFunction, application } from 'express'
import { ApplicationError } from '../../errors/errors'
export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  nextFunction: NextFunction
) {
  if (error instanceof ApplicationError) {
    return response.json({ Error: error.message }).status(error.statusCode)
  }

  return response.json('Internal server error').status(500)
}

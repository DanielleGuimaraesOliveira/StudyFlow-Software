export class ApplicationError extends Error {
  public statusCode: number

  constructor(mensagem: string, statusCode: number) {
    super(mensagem)
    this.name = 'ApplicationError'
    this.statusCode = statusCode
  }
}

export class DomainError extends ApplicationError {
  constructor(mensagem: string) {
    super(mensagem, 422)
  }
}

export class NotFoundError extends ApplicationError {
  constructor(mensagem: string) {
    super(mensagem, 404)
  }
}

export class DataBaseError extends ApplicationError {
  constructor(mensagem: string) {
    super(mensagem, 500)
  }
}

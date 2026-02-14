export class ValidationError extends Error {
  constructor(mensagem: string) {
    super(mensagem)
    this.name = 'ValidationError'
  }
}

export class DomainError extends Error {
  constructor(mensagem: string) {
    super(mensagem)
    this.name = 'DomainError'
  }
}

export class NotFoundError extends Error {
  constructor(mensagem: string) {
    super(mensagem)
    this.name = 'NotFoundError'
  }
}

export class DataBaseError extends Error {
  constructor(mensagem: string) {
    super(mensagem)
    this.name = 'DataBaseError'
  }
}

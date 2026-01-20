export class ErroValidacao extends Error {
  constructor(mensagem: string) {
    super(mensagem)
    this.name = 'ErroValidação'
  }
}

export class ErroDominio extends Error {
  constructor(mensagem: string) {
    super(mensagem)
    this.name = 'ErroDominio'
  }
}

export class ErroNaoEncontrado extends Error {
  constructor(mensagem: string) {
    super(mensagem)
    this.name = 'ErroNaoEncontrado'
  }
}

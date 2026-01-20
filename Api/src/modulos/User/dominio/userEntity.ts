import { ErroDominio, ErroValidacao } from '../../../Shared/erros/erros'

export interface UserPropriedades {
  id: number
  nome: string
  email: string
  senha: string
}

export class User {
  private id: number
  private nome: string
  private email: string
  private senha: string
  private dataCriacao: Date

  constructor(props: UserPropriedades) {
    this.validaNome(props.nome.trim())
    this.validaEmail(props.email)
    this.validaSenha(props.senha)

    this.id = props.id
    this.nome = props.nome.trim()
    this.email = props.email.toLowerCase()
    this.senha = props.senha
    this.dataCriacao = new Date()
  }

  private validaEmail(email: string): void {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(email)) throw new ErroValidacao('O email não está no formato válido')
  }

  private validaNome(nome: string): void {
    if (!nome.trim()) throw new ErroValidacao('o nome de usuário é obrigatório')
    if (nome.trim().length < 3)
      throw new ErroDominio('o nome de usuário deve ter no mínimo 3 caracteres')
    if (nome.trim().length > 100)
      throw new ErroDominio('o nome de usuário deve ter no máximo 100 caracteres')
  }

  private validaSenha(senha: string): void {
    if (!senha.trim()) throw new ErroValidacao('Senha é obrigatório')

    if (senha.length < 8) throw new ErroDominio('Senha deve ter no mínimo 8 caracteres')
    if (!/[A-Z]/.test(senha))
      throw new ErroDominio('Senha precisa de pelo menos uma letra maiúscula')

    if (!/[a-z]/.test(senha))
      throw new ErroDominio('Senha precisa de pelo menos uma letra minúscula')

    if (!/\d/.test(senha)) throw new ErroDominio('Senha precisa de pelo menos um número')

    if (!/[!@#$%^&*]/.test(senha))
      throw new ErroDominio('Senha precisa de um caractere especial (!@#$%^&*)')
  }

  public getId(): number {
    return this.id
  }

  public getNome(): string {
    return this.nome
  }

  public getDataCriacao(): Date {
    return this.dataCriacao
  }
  public alteraNome(novoNome: string): void {
    this.validaNome(novoNome)
    this.nome = novoNome.trim()
  }

  public alteraSenha(novaSenha: string): void {
    this.validaSenha(novaSenha)
    this.senha = novaSenha
  }

  public alteraEmail(novoEmail: string): void {
    this.validaEmail(novoEmail)
    this.email = novoEmail.toLowerCase()
  }
}

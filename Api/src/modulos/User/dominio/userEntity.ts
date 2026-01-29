import { hash } from 'bcrypt'
import { ErroDominio, ErroValidacao } from '../../../Shared/erros/erros'

export interface CriarUserPropriedades {
  id: number
  nome: string
  email: string
  senha: string
}

export interface UserPropriedades extends CriarUserPropriedades {
  dataCriacao: Date
}

export class User {
  private id: number
  private nome: string
  private email: string
  private senha: string
  private dataCriacao: Date

  constructor(props: CriarUserPropriedades) {
    this.validaNome(props.nome.trim())
    this.validaEmail(props.email)

    this.id = props.id
    this.nome = props.nome.trim()
    this.email = props.email.toLowerCase()
    this.senha = props.senha
    this.dataCriacao = new Date()
  }

  public defineSenhaTexto(senhaTexto: string): void {
    this.validaSenha(senhaTexto)
    this.senha = senhaTexto
  }

  public defineSenhaHash(senhaHash: string): void {
    this.senha = senhaHash
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

  public getEmail(): string {
    return this.email
  }

  public getDataCriacao(): Date {
    return this.dataCriacao
  }

  public alteraNome(novoNome: string): void {
    this.validaNome(novoNome)
    this.nome = novoNome.trim()
  }

  public alteraEmail(novoEmail: string): void {
    this.validaEmail(novoEmail)
    this.email = novoEmail.toLowerCase()
  }

  static fromDatabase(props: UserPropriedades): User {
    const user = Object.create(User.prototype)
    user.id = props.id
    user.nome = props.nome
    user.email = props.email
    user.senha = props.senha
    user.dataCriacao = props.dataCriacao
    return user
  }
}

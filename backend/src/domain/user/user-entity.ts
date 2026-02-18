import { DomainError } from '../../shared/errors/errors'
export interface UserProperties {
  id: number
  name: string
  email: string
}

export interface UserPropriedades extends UserProperties {
  createdAt: Date
}

export class User {
  private id: number
  private name: string
  private email: string
  private password!: string
  private createdAt: Date

  constructor(properties: UserProperties) {
    this.validateName(properties.name.trim())
    this.validateEmail(properties.email)

    this.id = properties.id
    this.name = properties.name.trim()
    this.email = properties.email.toLowerCase()
    this.createdAt = new Date()
  }

  public setPasswordHash(senhaTexto: string): void {
    this.validatePassword(senhaTexto)
    this.password = senhaTexto
  }

  private validateEmail(email: string): void {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(email)) throw new DomainError('Email is not in a valid format')
  }

  private validateName(name: string): void {
    if (!name.trim()) throw new DomainError('Username is required')
    if (name.trim().length < 3) throw new DomainError('Username must be at least 3 characters long')
    if (name.trim().length > 100)
      throw new DomainError('Username must be at most 100 characters long')
  }

  public validatePassword(password: string): void {
    if (!password.trim()) throw new DomainError('Password is required')

    if (password.length < 8) throw new DomainError('Password must be at least 8 characters long')
    if (!/[A-Z]/.test(password))
      throw new DomainError('Password must contain at least one uppercase letter')

    if (!/[a-z]/.test(password))
      throw new DomainError('Password must contain at least one lowercase letter')

    if (!/\d/.test(password)) throw new DomainError('Password must contain at least one number')

    if (!/[!@#$%^&*]/.test(password))
      throw new DomainError('Password must contain at least one special character (!@#$%^&*)')
  }

  public getId(): number {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getEmail(): string {
    return this.email
  }

  public getPassword(): string | null {
    return this.password
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public setNewName(newName: string): void {
    this.validateName(newName)
    this.name = newName.trim()
  }

  public setNewEmail(newEmail: string): void {
    this.validateEmail(newEmail)
    this.email = newEmail.toLowerCase()
  }

  static fromDatabase(properties: UserPropriedades & { senhaHash?: string }): User {
    const user = Object.create(User.prototype)
    user.id = properties.id
    user.name = properties.name
    user.email = properties.email
    user.createdAt = properties.createdAt

    return user
  }
}

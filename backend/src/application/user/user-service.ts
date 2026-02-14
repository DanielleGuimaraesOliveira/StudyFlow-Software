import { NotFoundError } from '../../shared/errors/errors'
import { User } from '../../domain/user/user-entity'
import { hash } from 'bcrypt'

export interface UserServiceDTO {
  name: string
  email: string
  password: string
}

export interface UserRepository {
  save(user: User): Promise<User>
  update(user: User): Promise<User | null>
  findById(userId: number): Promise<User | null>
  remove(userId: number): Promise<void>
}

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: UserServiceDTO): Promise<User> {
    const user = new User({
      id: 0,
      name: dto.name,
      email: dto.email,
    })

    user.validatePassword(dto.password)
    const hashPassword = await hash(dto.password, 10)
    user.setPasswordHash(hashPassword)

    return await this.userRepository.save(user)
  }

  async changeName(userId: number, newName: string): Promise<User> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundError(`Failed to find user with ID ${userId} in the database.`)

    user.setNewName(newName)

    const result = await this.userRepository.update(user)
    if (!result) throw new NotFoundError(`Failed to find user with ID ${userId} in the database.`)

    return result
  }

  async changeEmail(userId: number, newEmail: string): Promise<User> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundError(`Failed to find user with ID ${userId} in the database.`)

    user.setNewEmail(newEmail)

    const result = await this.userRepository.update(user)
    if (!result) throw new NotFoundError(`Failed to find user with ID ${userId} in the database.`)

    return result
  }

  async changePassword(userId: number, newPassword: string): Promise<User> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundError(`Failed to find user with ID ${userId} in the database.`)

    user.validatePassword(newPassword)
    const hashPassword = await hash(newPassword, 10)
    user.setPasswordHash(hashPassword)

    const result = await this.userRepository.update(user)
    if (!result) throw new NotFoundError(`Failed to find user with ID ${userId} in the database.`)

    return result
  }

  async delete(userId: number): Promise<void> {
    const result = await this.userRepository.findById(userId)
    if (!result) throw new NotFoundError(`Failed to find user with ID ${userId} in the database.`)
    await this.userRepository.remove(userId)
  }
}

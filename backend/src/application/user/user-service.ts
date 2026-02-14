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
  update(user: User): Promise<User>
  findById(userId: number): Promise<User | null>
  deleteById(userId: number): Promise<void>
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

  async searchById(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundError(`Failed to find user with ID ${userId} in the database.`)
    return user
  }

  async changeName(userId: number, newName: string): Promise<User> {
    const user = await this.searchById(userId)

    user.setNewName(newName)

    return await this.userRepository.update(user)
  }

  async changeEmail(userId: number, newEmail: string): Promise<User> {
    const user = await this.searchById(userId)

    user.setNewEmail(newEmail)

    return await this.userRepository.update(user)
  }

  async changePassword(userId: number, newPassword: string): Promise<User> {
    const user = await this.searchById(userId)

    user.validatePassword(newPassword)
    const hashPassword = await hash(newPassword, 10)
    user.setPasswordHash(hashPassword)

    return await this.userRepository.update(user)
  }

  async delete(userId: number): Promise<void> {
    await this.searchById(userId)
    await this.userRepository.deleteById(userId)
  }
}

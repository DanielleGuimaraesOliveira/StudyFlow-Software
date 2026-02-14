import { UserRepository, UserService } from '../../application/user/user-service'
import { User } from '../../domain/user/user-entity'
import { NotFoundError } from '../../shared/errors/errors'

describe('UserService', () => {
  let userService: UserService
  let userRepositoryMock: jest.Mocked<UserRepository>

  beforeEach(() => {
    userRepositoryMock = {
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      remove: jest.fn(),
    }

    userService = new UserService(userRepositoryMock)
  })

  describe('create', () => {
    it('Should create a user correctly', async () => {
      userRepositoryMock.save.mockImplementation(async (user) => user)

      const userResult = await userService.create({
        name: 'Dani',
        email: 'danielle@gmail.com',
        password: 'Dani123#q',
      })

      expect(userResult.getPassword()).not.toBe('Dani123#q')
      expect(userResult.getPassword()).toMatch(/^\$2[aby]\$/)
      expect(userRepositoryMock.save).toHaveBeenCalledTimes(1)
    })

    it('Should throw when creating a user with an invalid password', async () => {
      await expect(async () => {
        await userService.create({ name: 'Dani', email: 'danielle@gmail.com', password: '123' })
      }).rejects.toThrow('Password must be at least 8 characters long')
    })

    it('Should throw when creating a user with an invalid email', async () => {
      await expect(async () => {
        await userService.create({ name: 'Dani', email: 'email_invalido', password: 'Dani123#q' })
      }).rejects.toThrow('Email is not in a valid format')
    })
  })

  describe('changeName', () => {
    it('Should update the user name correctly', async () => {
      const user = new User({ id: 1, name: 'Danielle', email: 'dani@gmail.com' })
      userRepositoryMock.findById.mockResolvedValue(user)
      userRepositoryMock.update.mockImplementation(async (user) => user)

      const result = await userService.changeName(1, 'Joao')

      expect(result.getName()).toBe('Joao')
      expect(userRepositoryMock.findById).toHaveBeenCalledWith(1)
      expect(userRepositoryMock.update).toHaveBeenCalledTimes(1)
    })

    it('Should throw when the user is not found', async () => {
      userRepositoryMock.findById.mockResolvedValue(null)

      await expect(async () => {
        await userService.changeName(1, 'Joao')
      }).rejects.toThrow(new NotFoundError('Failed to find user with ID 1 in the database.'))
    })

    it('Should throw when updating to an invalid name', async () => {
      const user = new User({ id: 1, name: 'Danielle', email: 'dani@gmail.com' })
      userRepositoryMock.findById.mockResolvedValue(user)

      await expect(async () => {
        await userService.changeName(1, 'ab')
      }).rejects.toThrow('Username must be at least 3 characters long')
    })

    it('Should throw when the update fails', async () => {
      const user = new User({ id: 1, name: 'Danielle', email: 'dani@gmail.com' })
      userRepositoryMock.findById.mockResolvedValue(user)
      userRepositoryMock.update.mockResolvedValue(null)

      await expect(async () => {
        await userService.changeName(1, 'Joao')
      }).rejects.toThrow(new NotFoundError('Failed to find user with ID 1 in the database.'))
    })
  })

  describe('changeEmail', () => {
    it('Should update the user email correctly', async () => {
      const user = new User({ id: 1, name: 'Danielle', email: 'dani@gmail.com' })
      userRepositoryMock.findById.mockResolvedValue(user)
      userRepositoryMock.update.mockImplementation(async (user) => user)

      const result = await userService.changeEmail(1, 'newemail@gmail.com')

      expect(result.getEmail()).toBe('newemail@gmail.com')
      expect(userRepositoryMock.findById).toHaveBeenCalledWith(1)
      expect(userRepositoryMock.update).toHaveBeenCalledTimes(1)
    })

    it('Should throw when the user is not found', async () => {
      userRepositoryMock.findById.mockResolvedValue(null)

      await expect(async () => {
        await userService.changeEmail(1, 'newemail@gmail.com')
      }).rejects.toThrow(new NotFoundError('Failed to find user with ID 1 in the database.'))
    })

    it('Should throw when updating to an invalid email', async () => {
      const user = new User({ id: 1, name: 'Danielle', email: 'dani@gmail.com' })
      userRepositoryMock.findById.mockResolvedValue(user)

      await expect(async () => {
        await userService.changeEmail(1, 'email_invalido')
      }).rejects.toThrow('Email is not in a valid format')
    })
  })

  describe('changePassword', () => {
    it('Should update the user password correctly', async () => {
      const user = new User({ id: 1, name: 'Danielle', email: 'dani@gmail.com' })
      user.setPasswordHash('Dani123#q')
      userRepositoryMock.findById.mockResolvedValue(user)
      userRepositoryMock.update.mockImplementation(async (user) => user)

      await userService.changePassword(1, 'NewPassword@123')

      expect(userRepositoryMock.findById).toHaveBeenCalledWith(1)
      expect(userRepositoryMock.update).toHaveBeenCalledTimes(1)
    })

    it('Should throw when the user is not found', async () => {
      userRepositoryMock.findById.mockResolvedValue(null)

      await expect(async () => {
        await userService.changePassword(1, 'NewPassword@123')
      }).rejects.toThrow(new NotFoundError('Failed to find user with ID 1 in the database.'))
    })

    it('Should throw when updating to an invalid password', async () => {
      const user = new User({ id: 1, name: 'Danielle', email: 'dani@gmail.com' })
      
      userRepositoryMock.findById.mockResolvedValue(user)

      await expect(async () => {
        await userService.changePassword(1, '123')
      }).rejects.toThrow('Password must be at least 8 characters long')
    })
  })

  describe('delete', () => {
    it('Should delete the user correctly', async () => {
      const user = new User({ id: 1, name: 'Danielle', email: 'dani@gmail.com' })
      userRepositoryMock.findById.mockResolvedValue(user)
      userRepositoryMock.remove.mockResolvedValue()

      await userService.delete(1)

      expect(userRepositoryMock.findById).toHaveBeenCalledWith(1)
      expect(userRepositoryMock.remove).toHaveBeenCalledWith(1)
    })

    it('Should throw when the user is not found', async () => {
      userRepositoryMock.findById.mockResolvedValue(null)

      await expect(async () => {
        await userService.delete(1)
      }).rejects.toThrow(new NotFoundError('Failed to find user with ID 1 in the database.'))
    })
  })
})

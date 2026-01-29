import { UserRepository, UserService } from '../aplicacao/UserService'
import { User } from '../dominio/userEntity'
import { ErroNaoEncontrado } from '../../../Shared/erros/erros'

describe('UserService', () => {
  let userService: UserService
  let userRepositoryMock: jest.Mocked<UserRepository>

  beforeEach(() => {
    userRepositoryMock = {
      criarUsuario: jest.fn(),
      atualizar: jest.fn(),
      buscarPorId: jest.fn(),
      deletar: jest.fn(),
    }

    userService = new UserService(userRepositoryMock)
  })

  describe('criaUser', () => {
    it('Deve criar um usuário corretamente', async () => {
      userRepositoryMock.criarUsuario.mockImplementation(async (user) => user)

      const userResultado = await userService.criaUser({
        nome: 'Dani',
        email: 'danielle@gmail.com',
        senha: 'Dani123#q',
      })

      expect(userResultado['senha']).not.toBe('Dani123#q')
      expect(userResultado['senha']).toMatch(/^\$2[aby]\$/)
      expect(userRepositoryMock.criarUsuario).toHaveBeenCalledTimes(1)
    })

    it('Deve lançar erro ao criar usuário com senha inválida', async () => {
      await expect(async () => {
        await userService.criaUser({ nome: 'Dani', email: 'danielle@gmail.com', senha: '123' })
      }).rejects.toThrow('Senha deve ter no mínimo 8 caracteres')
    })

    it('Deve lançar erro ao criar usuário com email inválido', async () => {
      await expect(async () => {
        await userService.criaUser({ nome: 'Dani', email: 'email_invalido', senha: 'Dani123#q' })
      }).rejects.toThrow('O email não está no formato válido')
    })
  })

  describe('alteraNome', () => {
    it('Deve alterar o nome do usuário corretamente', async () => {
      const usuario = new User({ id: 1, nome: 'Danielle', email: 'dani@gmail.com', senha: '' })
      userRepositoryMock.buscarPorId.mockResolvedValue(usuario)
      userRepositoryMock.atualizar.mockImplementation(async (user) => user)

      const resultado = await userService.alteraNome(1, 'João')

      expect(resultado.getNome()).toBe('João')
      expect(userRepositoryMock.buscarPorId).toHaveBeenCalledWith(1)
      expect(userRepositoryMock.atualizar).toHaveBeenCalledTimes(1)
    })

    it('Deve lançar erro quando usuário não é encontrado', async () => {
      userRepositoryMock.buscarPorId.mockResolvedValue(null)

      await expect(async () => {
        await userService.alteraNome(1, 'João')
      }).rejects.toThrow(ErroNaoEncontrado)
    })

    it('Deve lançar erro ao alterar para nome inválido', async () => {
      const usuario = new User({ id: 1, nome: 'Danielle', email: 'dani@gmail.com', senha: '' })
      userRepositoryMock.buscarPorId.mockResolvedValue(usuario)

      await expect(async () => {
        await userService.alteraNome(1, 'ab')
      }).rejects.toThrow('o nome de usuário deve ter no mínimo 3 caracteres')
    })

    it('Deve lançar erro quando atualização falha', async () => {
      const usuario = new User({ id: 1, nome: 'Danielle', email: 'dani@gmail.com', senha: '' })
      userRepositoryMock.buscarPorId.mockResolvedValue(usuario)
      userRepositoryMock.atualizar.mockResolvedValue(null)

      await expect(async () => {
        await userService.alteraNome(1, 'João')
      }).rejects.toThrow(ErroNaoEncontrado)
    })
  })

  describe('alterarEmail', () => {
    it('Deve alterar o email do usuário corretamente', async () => {
      const usuario = new User({ id: 1, nome: 'Danielle', email: 'dani@gmail.com', senha: '' })
      userRepositoryMock.buscarPorId.mockResolvedValue(usuario)
      userRepositoryMock.atualizar.mockImplementation(async (user) => user)

      const resultado = await userService.alterarEmail(1, 'novoemail@gmail.com')

      expect(resultado.getEmail()).toBe('novoemail@gmail.com')
      expect(userRepositoryMock.buscarPorId).toHaveBeenCalledWith(1)
      expect(userRepositoryMock.atualizar).toHaveBeenCalledTimes(1)
    })

    it('Deve lançar erro quando usuário não é encontrado', async () => {
      userRepositoryMock.buscarPorId.mockResolvedValue(null)

      await expect(async () => {
        await userService.alterarEmail(1, 'novoemail@gmail.com')
      }).rejects.toThrow(ErroNaoEncontrado)
    })

    it('Deve lançar erro ao alterar para email inválido', async () => {
      const usuario = new User({ id: 1, nome: 'Danielle', email: 'dani@gmail.com', senha: '' })
      userRepositoryMock.buscarPorId.mockResolvedValue(usuario)

      await expect(async () => {
        await userService.alterarEmail(1, 'email_invalido')
      }).rejects.toThrow('O email não está no formato válido')
    })
  })

  describe('alterarSenha', () => {
    it('Deve alterar a senha do usuário corretamente', async () => {
      const usuario = new User({ id: 1, nome: 'Danielle', email: 'dani@gmail.com', senha: '' })
      usuario.defineSenhaTexto('Dani123#q')
      userRepositoryMock.buscarPorId.mockResolvedValue(usuario)
      userRepositoryMock.atualizar.mockImplementation(async (user) => user)

      const resultado = await userService.alterarSenha(1, 'NovaSenha@123')

      expect(userRepositoryMock.buscarPorId).toHaveBeenCalledWith(1)
      expect(userRepositoryMock.atualizar).toHaveBeenCalledTimes(1)
    })

    it('Deve lançar erro quando usuário não é encontrado', async () => {
      userRepositoryMock.buscarPorId.mockResolvedValue(null)

      await expect(async () => {
        await userService.alterarSenha(1, 'NovaSenha@123')
      }).rejects.toThrow(ErroNaoEncontrado)
    })

    it('Deve lançar erro ao alterar para senha inválida', async () => {
      const usuario = new User({ id: 1, nome: 'Danielle', email: 'dani@gmail.com', senha: '' })
      userRepositoryMock.buscarPorId.mockResolvedValue(usuario)

      await expect(async () => {
        await userService.alterarSenha(1, '123')
      }).rejects.toThrow('Senha deve ter no mínimo 8 caracteres')
    })
  })

  describe('deletarUser', () => {
    it('Deve deletar o usuário corretamente', async () => {
      const usuario = new User({ id: 1, nome: 'Danielle', email: 'dani@gmail.com', senha: '' })
      userRepositoryMock.buscarPorId.mockResolvedValue(usuario)
      userRepositoryMock.deletar.mockResolvedValue()

      await userService.deletarUser(1)

      expect(userRepositoryMock.buscarPorId).toHaveBeenCalledWith(1)
      expect(userRepositoryMock.deletar).toHaveBeenCalledWith(1)
    })

    it('Deve lançar erro quando usuário não é encontrado', async () => {
      userRepositoryMock.buscarPorId.mockResolvedValue(null)

      await expect(async () => {
        await userService.deletarUser(1)
      }).rejects.toThrow(ErroNaoEncontrado)
    })
  })
})

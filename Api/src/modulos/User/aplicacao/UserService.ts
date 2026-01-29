import { ErroNaoEncontrado } from '../../../Shared/erros/erros'
import { User } from '../dominio/userEntity'
import { hashSync } from 'bcrypt'

export interface UserServiceDTO {
  nome: string
  email: string
  senha: string
}

export interface UserRepository {
  criarUsuario(user: User): Promise<User>
  atualizar(user: User): Promise<User | null>
  buscarPorId(userId: number): Promise<User | null>
  deletar(userId: number): Promise<void>
}

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async criaUser(dto: UserServiceDTO): Promise<User> {
    const user = new User({
      id: 0,
      nome: dto.nome,
      email: dto.email,
      senha: '',
    })

    user.defineSenhaTexto(dto.senha)
    const senhaHash = hashSync(dto.senha, 10)
    user.defineSenhaHash(senhaHash)

    return await this.userRepository.criarUsuario(user)
  }

  async alteraNome(id: number, novoNome: string): Promise<User> {
    const user = await this.userRepository.buscarPorId(id)
    if (!user) throw new ErroNaoEncontrado(`Erro ao encontrar o usuário de ID ${id} banco de dados`)

    user.alteraNome(novoNome)

    const resultado = await this.userRepository.atualizar(user)
    if (!resultado)
      throw new ErroNaoEncontrado(`Erro ao encontrar o usuário de ID ${id} banco de dados`)

    return resultado
  }

  async alterarEmail(id: number, novoEmail: string): Promise<User> {
    const user = await this.userRepository.buscarPorId(id)
    if (!user) throw new ErroNaoEncontrado(`Erro ao encontrar o usuário de ID ${id} banco de dados`)

    user.alteraEmail(novoEmail)

    const resultado = await this.userRepository.atualizar(user)
    if (!resultado)
      throw new ErroNaoEncontrado(`Erro ao encontrar o usuário de ID ${id} banco de dados`)

    return resultado
  }

  async alterarSenha(id: number, novaSenha: string): Promise<User> {
    const user = await this.userRepository.buscarPorId(id)
    if (!user) throw new ErroNaoEncontrado(`Erro ao encontrar o usuário de ID ${id} banco de dados`)

    user.defineSenhaTexto(novaSenha)
    const senhaHash = hashSync(novaSenha, 10)
    user.defineSenhaHash(senhaHash)

    const resultado = await this.userRepository.atualizar(user)
    if (!resultado)
      throw new ErroNaoEncontrado(`Erro ao encontrar o usuário de ID ${id} banco de dados`)

    return resultado
  }

  async deletarUser(id: number): Promise<void> {
    const resultado = await this.userRepository.buscarPorId(id)
    if (!resultado)
      throw new ErroNaoEncontrado(`Erro ao encontrar o usuário de ID ${id} banco de dados`)
    await this.userRepository.deletar(id)
  }
}

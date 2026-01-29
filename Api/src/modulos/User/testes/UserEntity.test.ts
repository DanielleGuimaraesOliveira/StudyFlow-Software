import { User } from '../dominio/userEntity'

describe('UserEntity', () => {
  it('Deve criar um usuário corretamente', () => {
    const usuario = new User({
      id: 1,
      nome: 'danielle',
      email: 'danielle@gmail.com',
      senha: 'Dani123!',
    })
    const data = new Date()

    expect(usuario.getId()).toBe(1)
    expect(usuario.getNome()).toBe('danielle')
    expect(usuario.getDataCriacao().getDate()).toBe(data.getDate())
  })

  it('Deve retornar um erro quando o nome não é preenchido', () => {
    expect(() => {
      new User({ id: 1, nome: '', email: 'danielle@gmail.com', senha: 'Dani123!' })
    }).toThrow('o nome de usuário é obrigatório')
  })

  it('Deve retornar um erro quando o nome tem menos de 3 caracteres', () => {
    expect(() => {
      new User({ id: 1, nome: 'da', email: 'danielle@gmail.com', senha: 'Dani123!' })
    }).toThrow('o nome de usuário deve ter no mínimo 3 caracteres')
  })
  it('Deve retornar um erro quando o nome tem mais de 100 caracteres', () => {
    expect(() => {
      new User({
        id: 1,
        nome: 'dannnnanananananananannnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
        email: 'danielle@gmail.com',
        senha: 'Dani123!',
      })
    }).toThrow('o nome de usuário deve ter no máximo 100 caracteres')
  })

  // Testes de Email
  it('Deve retornar um erro quando o email é inválido', () => {
    expect(() => {
      new User({ id: 1, nome: 'danielle', email: 'email_invalido', senha: 'Dani123!' })
    }).toThrow('O email não está no formato válido')
  })

  it('Deve retornar um erro quando o email não contém @', () => {
    expect(() => {
      new User({ id: 1, nome: 'danielle', email: 'emailgmail.com', senha: 'Dani123!' })
    }).toThrow('O email não está no formato válido')
  })

  it('Deve retornar um erro quando o email não contém domínio', () => {
    expect(() => {
      new User({ id: 1, nome: 'danielle', email: 'email@gmail', senha: 'Dani123!' })
    }).toThrow('O email não está no formato válido')
  })

  it('Deve retornar o email em minúsculas', () => {
    const usuario = new User({
      id: 1,
      nome: 'danielle',
      email: 'DANIELLE@GMAIL.COM',
      senha: 'Dani123!',
    })
    expect(usuario.getEmail()).toBe('danielle@gmail.com')
  })

  // Testes de Senha
  it('Deve retornar um erro quando a senha não é preenchida', () => {
    const usuario = new User({ id: 1, nome: 'danielle', email: 'danielle@gmail.com', senha: '' })
    expect(() => {
      usuario.defineSenhaTexto('')
    }).toThrow('Senha é obrigatório')
  })

  it('Deve retornar um erro quando a senha tem menos de 8 caracteres', () => {
    const usuario = new User({ id: 1, nome: 'danielle', email: 'danielle@gmail.com', senha: '' })
    expect(() => {
      usuario.defineSenhaTexto('Dan12!')
    }).toThrow('Senha deve ter no mínimo 8 caracteres')
  })

  it('Deve retornar um erro quando a senha não contém letra maiúscula', () => {
    const usuario = new User({ id: 1, nome: 'danielle', email: 'danielle@gmail.com', senha: '' })
    expect(() => {
      usuario.defineSenhaTexto('danielle123!')
    }).toThrow('Senha precisa de pelo menos uma letra maiúscula')
  })

  it('Deve retornar um erro quando a senha não contém letra minúscula', () => {
    const usuario = new User({ id: 1, nome: 'danielle', email: 'danielle@gmail.com', senha: '' })
    expect(() => {
      usuario.defineSenhaTexto('DANIELLE123!')
    }).toThrow('Senha precisa de pelo menos uma letra minúscula')
  })

  it('Deve retornar um erro quando a senha não contém número', () => {
    const usuario = new User({ id: 1, nome: 'danielle', email: 'danielle@gmail.com', senha: '' })
    expect(() => {
      usuario.defineSenhaTexto('Danielle!')
    }).toThrow('Senha precisa de pelo menos um número')
  })

  it('Deve retornar um erro quando a senha não contém caractere especial', () => {
    const usuario = new User({ id: 1, nome: 'danielle', email: 'danielle@gmail.com', senha: '' })
    expect(() => {
      usuario.defineSenhaTexto('Danielle123')
    }).toThrow('Senha precisa de um caractere especial (!@#$%^&*)')
  })

  // Testes de métodos de alteração
  it('Deve alterar o nome corretamente', () => {
    const usuario = new User({
      id: 1,
      nome: 'danielle',
      email: 'danielle@gmail.com',
      senha: 'Dani123!',
    })
    usuario.alteraNome('joão')
    expect(usuario.getNome()).toBe('joão')
  })

  it('Deve retornar erro ao alterar nome para vazio', () => {
    const usuario = new User({
      id: 1,
      nome: 'danielle',
      email: 'danielle@gmail.com',
      senha: 'Dani123!',
    })
    expect(() => {
      usuario.alteraNome('')
    }).toThrow('o nome de usuário é obrigatório')
  })

  it('Deve alterar o email corretamente', () => {
    const usuario = new User({
      id: 1,
      nome: 'danielle',
      email: 'danielle@gmail.com',
      senha: 'Dani123!',
    })
    usuario.alteraEmail('novo@gmail.com')
    expect(usuario.getEmail()).toBe('novo@gmail.com')
  })

  it('Deve retornar erro ao alterar email para inválido', () => {
    const usuario = new User({
      id: 1,
      nome: 'danielle',
      email: 'danielle@gmail.com',
      senha: 'Dani123!',
    })
    expect(() => {
      usuario.alteraEmail('email_invalido')
    }).toThrow('O email não está no formato válido')
  })

  it('Deve alterar a senha corretamente', () => {
    const usuario = new User({
      id: 1,
      nome: 'danielle',
      email: 'danielle@gmail.com',
      senha: '',
    })
    usuario.defineSenhaTexto('Dani123!')
    usuario.defineSenhaTexto('NovaSenha@123')
    expect(usuario.getId()).toBe(1)
  })

  it('Deve retornar a data de criação', () => {
    const dataAntes = new Date()
    const usuario = new User({
      id: 1,
      nome: 'danielle',
      email: 'danielle@gmail.com',
      senha: '',
    })
    const dataDepois = new Date()

    expect(usuario.getDataCriacao().getTime()).toBeGreaterThanOrEqual(dataAntes.getTime())
    expect(usuario.getDataCriacao().getTime()).toBeLessThanOrEqual(dataDepois.getTime())
  })
})

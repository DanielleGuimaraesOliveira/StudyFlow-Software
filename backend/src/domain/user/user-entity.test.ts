import { User } from '../user/user-entity'

describe('UserEntity', () => {
  it('Should create a user correctly', () => {
    const user = new User({
      id: 1,
      name: 'danielle',
      email: 'danielle@gmail.com',
    })
    const data = new Date()

    expect(user.getId()).toBe(1)
    expect(user.getName()).toBe('danielle')
    expect(user.getCreatedAt().getDate()).toBe(data.getDate())
  })

  it('Should throw when the name is empty', () => {
    expect(() => {
      new User({ id: 1, name: '', email: 'danielle@gmail.com' })
    }).toThrow('Username is required')
  })

  it('Should throw when the name has fewer than 3 characters', () => {
    expect(() => {
      new User({ id: 1, name: 'da', email: 'danielle@gmail.com' })
    }).toThrow('Username must be at least 3 characters long')
  })
  it('Should throw when the name has more than 100 characters', () => {
    const longName = 'a'.repeat(101)
    expect(() => {
      new User({
        id: 1,
        name: longName,
        email: 'danielle@gmail.com',
      })
    }).toThrow('Username must be at most 100 characters long')
  })

  // Email tests
  it('Should throw when the email is invalid', () => {
    expect(() => {
      new User({ id: 1, name: 'danielle', email: 'email_invalido' })
    }).toThrow('Email is not in a valid format')
  })

  it('Should throw when the email does not contain @', () => {
    expect(() => {
      new User({ id: 1, name: 'danielle', email: 'emailgmail.com' })
    }).toThrow('Email is not in a valid format')
  })

  it('Should throw when the email does not contain a domain', () => {
    expect(() => {
      new User({ id: 1, name: 'danielle', email: 'email@gmail' })
    }).toThrow('Email is not in a valid format')
  })

  it('Should return the email in lowercase', () => {
    const user = new User({
      id: 1,
      name: 'danielle',
      email: 'DANIELLE@GMAIL.COM',
    })
    expect(user.getEmail()).toBe('danielle@gmail.com')
  })

  // Password tests
  it('Should throw when the password is empty', () => {
    const user = new User({ id: 1, name: 'danielle', email: 'danielle@gmail.com' })
    expect(() => {
      user.setPasswordHash('')
    }).toThrow('Password is required')
  })

  it('Should throw when the password has fewer than 8 characters', () => {
    const user = new User({ id: 1, name: 'danielle', email: 'danielle@gmail.com' })
    expect(() => {
      user.setPasswordHash('Dan12!')
    }).toThrow('Password must be at least 8 characters long')
  })

  it('Should throw when the password has no uppercase letter', () => {
    const user = new User({ id: 1, name: 'danielle', email: 'danielle@gmail.com' })
    expect(() => {
      user.setPasswordHash('danielle123!')
    }).toThrow('Password must contain at least one uppercase letter')
  })

  it('Should throw when the password has no lowercase letter', () => {
    const user = new User({ id: 1, name: 'danielle', email: 'danielle@gmail.com' })
    expect(() => {
      user.setPasswordHash('DANIELLE123!')
    }).toThrow('Password must contain at least one lowercase letter')
  })

  it('Should throw when the password has no number', () => {
    const user = new User({ id: 1, name: 'danielle', email: 'danielle@gmail.com' })
    expect(() => {
      user.setPasswordHash('Danielle!')
    }).toThrow('Password must contain at least one number')
  })

  it('Should throw when the password has no special character', () => {
    const user = new User({ id: 1, name: 'danielle', email: 'danielle@gmail.com' })
    expect(() => {
      user.setPasswordHash('Danielle123')
    }).toThrow('Password must contain at least one special character (!@#$%^&*)')
  })

  // Update methods
  it('Should update the name correctly', () => {
    const user = new User({
      id: 1,
      name: 'danielle',
      email: 'danielle@gmail.com',
    })
    user.setNewName('joao')
    expect(user.getName()).toBe('joao')
  })

  it('Should throw when updating name to empty', () => {
    const user = new User({
      id: 1,
      name: 'danielle',
      email: 'danielle@gmail.com',
    })
    expect(() => {
      user.setNewName('')
    }).toThrow('Username is required')
  })

  it('Should update the email correctly', () => {
    const user = new User({
      id: 1,
      name: 'danielle',
      email: 'danielle@gmail.com',
    })
    user.setNewEmail('new@gmail.com')
    expect(user.getEmail()).toBe('new@gmail.com')
  })

  it('Should throw when updating email to invalid', () => {
    const user = new User({
      id: 1,
      name: 'danielle',
      email: 'danielle@gmail.com',
    })
    expect(() => {
      user.setNewEmail('email_invalido')
    }).toThrow('Email is not in a valid format')
  })

  it('Should update the password correctly', () => {
    const user = new User({
      id: 1,
      name: 'danielle',
      email: 'danielle@gmail.com',
    })
    user.setPasswordHash('Dani123!')
    user.setPasswordHash('NovaSenha@123')
    expect(user.getId()).toBe(1)
  })

  it('Should return the creation date', () => {
    const dataAntes = new Date()
    const user = new User({
      id: 1,
      name: 'danielle',
      email: 'danielle@gmail.com',
    })
    const dataDepois = new Date()

    expect(user.getCreatedAt().getTime()).toBeGreaterThanOrEqual(dataAntes.getTime())
    expect(user.getCreatedAt().getTime()).toBeLessThanOrEqual(dataDepois.getTime())
  })
})

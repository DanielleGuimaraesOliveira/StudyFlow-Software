import { Task } from './task'

describe('Task', () => {
  it('Deve criar uma task com as propriedades corretas', () => {
    const dataCriacao = new Date('2024-06-01')
    const task = new Task({
      id: 1,
      titulo: 'Estudar TypeScript',
      descricao: 'Ler a documentação oficial do TypeScript',
      dataCriacao: dataCriacao,
      taskStatus: 'Pendente',
    })

    expect(task.getId()).toBe(1)
    expect(task.getTitulo()).toBe('Estudar TypeScript')
    expect(task.getDescricao()).toBe('Ler a documentação oficial do TypeScript')
    expect(task.getTaskStatus()).toBe('Pendente')
    expect(task.getDataCriacao()).toBe(dataCriacao)
  })

  it('Deve criar uma task com status padrão Pendente e data de criação atual', () => {
    const dataAntiga = new Date()
    const task = new Task({
      id: 2,
      titulo: 'Fazer exercícios',
      descricao: 'Resolver problemas de programação',
    })
    const dataNova = new Date()

    expect(task.getId()).toBe(2)
    expect(task.getTitulo()).toBe('Fazer exercícios')
    expect(task.getDescricao()).toBe('Resolver problemas de programação')
    expect(task.getTaskStatus()).toBe('Pendente')
    expect(task.getDataCriacao().getTime()).toBeGreaterThanOrEqual(dataNova.getTime())
    expect(task.getDataCriacao().getTime()).toBeLessThanOrEqual(dataAntiga.getTime())
  })

  it('Deve permitir alterar o status de pendente para em andamento', () => {
    const dataCriacao = new Date('2020-06-12')
    const task = new Task({
      id: 3,
      titulo: 'estudando inglês',
      descricao: 'chegar no nível C1',
      dataCriacao: dataCriacao,
    })

    expect(task.getTaskStatus()).toBe('Pendente')
    task.setStatusEmAndamento()
    expect(task.getId()).toBe(3)
    expect(task.getTitulo()).toBe('estudando inglês')
    expect(task.getDescricao()).toBe('chegar no nível C1')
    expect(task.getTaskStatus()).toBe('Em Andamento')
    expect(task.getDataCriacao()).toBe(dataCriacao)
  })

  it('Deve permitir alterar o status de em andamento para concluída', () => {
    const dataCriacao = new Date('2020-06-12')
    const task = new Task({
      id: 3,
      titulo: 'estudando inglês',
      descricao: 'chegar no nível C1',
      taskStatus: 'Em Andamento',
      dataCriacao: dataCriacao,
    })

    expect(task.getTaskStatus()).toBe('Em Andamento')
    task.setStatusConcluido()
    expect(task.getId()).toBe(3)
    expect(task.getTitulo()).toBe('estudando inglês')
    expect(task.getDescricao()).toBe('chegar no nível C1')
    expect(task.getTaskStatus()).toBe('Concluída')
    expect(task.getDataCriacao()).toBe(dataCriacao)
  })

  it('Deve permitir alterar o titulo da tarefa', () => {
    const dataCriacao = new Date('2020-06-12')
    const task = new Task({
      id: 3,
      titulo: 'estudando inglês',
      descricao: 'chegar no nível C1',
      taskStatus: 'Em Andamento',
      dataCriacao: dataCriacao,
    })
    expect(task.getTitulo()).toBe('estudando inglês')
    task.alteraTituloTask('estudando espanhol')
    expect(task.getId()).toBe(3)
    expect(task.getTitulo()).toBe('estudando espanhol')
    expect(task.getDescricao()).toBe('chegar no nível C1')
    expect(task.getTaskStatus()).toBe('Em Andamento')
    expect(task.getDataCriacao()).toBe(dataCriacao)
  })
})

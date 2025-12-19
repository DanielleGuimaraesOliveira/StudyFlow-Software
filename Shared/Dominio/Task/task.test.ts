import { Task } from './task'
import { TaskStatus, TaskPrioridade } from './taskEnums'

describe('Task', () => {
  it('Deve criar uma task com as propriedades corretas', () => {
    const dataCriacao = new Date('2024-06-01')
    const dataFinal = new Date('2025-06-01')
    const task = new Task({
      id: 1,
      titulo: 'Estudar TypeScript',
      descricao: 'Ler a documentação oficial do TypeScript',
      dataCriacao: dataCriacao,
      taskPrioridade: TaskPrioridade.Baixa,
      taskStatus: TaskStatus.Pendente,
      dataFinal: dataFinal,
    })

    expect(task.getId()).toBe(1)
    expect(task.getTitulo()).toBe('Estudar TypeScript')
    expect(task.getDescricao()).toBe('Ler a documentação oficial do TypeScript')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pendente)
    expect(task.getTaskPrioridade()).toBe(TaskPrioridade.Baixa)
    expect(task.getDataCriacao()).toBe(dataCriacao)
    expect(task.getDataFinal()).toBe(dataFinal)
  })

  it('Deve criar data de criação da task como o padrão', () => {
    const dataAntiga = new Date()
    const dataFinal = new Date('2025-06-01')
    const task = new Task({
      id: 2,
      titulo: 'Fazer exercícios',
      descricao: 'Resolver problemas de programação',
      taskPrioridade: TaskPrioridade.Baixa,
      taskStatus: TaskStatus.Pendente,
      dataFinal: dataFinal,
    })
    const dataNova = new Date()

    expect(task.getId()).toBe(2)
    expect(task.getTitulo()).toBe('Fazer exercícios')
    expect(task.getDescricao()).toBe('Resolver problemas de programação')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pendente)
    expect(task.getTaskPrioridade()).toBe(TaskPrioridade.Baixa)
    expect(task.getDataCriacao().getTime()).toBeLessThanOrEqual(dataNova.getTime())
    expect(task.getDataCriacao().getTime()).toBeGreaterThanOrEqual(dataAntiga.getTime())
    expect(task.getDataCriacao().getDate()).toBe(dataAntiga.getDate())
    expect(task.getDataFinal()).toBe(dataFinal)
  })

  it('Deve permitir alterar o status de pendente para em andamento', () => {
    const dataCriacao = new Date('2020-06-12')
    const dataFinal = new Date('2025-06-01')
    const task = new Task({
      id: 3,
      titulo: 'estudando inglês',
      descricao: 'chegar no nível C1',
      taskPrioridade: TaskPrioridade.Baixa,
      taskStatus: TaskStatus.Pendente,
      dataCriacao: dataCriacao,
      dataFinal: dataFinal,
    })

    expect(task.getTaskStatus()).toBe(TaskStatus.Pendente)
    task.setStatusEmAndamento()
    expect(task.getId()).toBe(3)
    expect(task.getTitulo()).toBe('estudando inglês')
    expect(task.getDescricao()).toBe('chegar no nível C1')
    expect(task.getTaskPrioridade()).toBe(TaskPrioridade.Baixa)
    expect(task.getTaskStatus()).toBe(TaskStatus.EmAndamento)
    expect(task.getDataCriacao()).toBe(dataCriacao)
    expect(task.getDataFinal()).toBe(dataFinal)
  })

  it('Deve permitir alterar o status de em andamento para concluída', () => {
    const dataCriacao = new Date('2020-06-12')
    const dataFinal = new Date('2023-06-01')
    const task = new Task({
      id: 4,
      titulo: 'Estudar Java',
      descricao: 'Ler a documentação oficial do Java',
      dataCriacao: dataCriacao,
      taskPrioridade: TaskPrioridade.Baixa,
      taskStatus: TaskStatus.EmAndamento,
      dataFinal: dataFinal,
    })

    expect(task.getTaskStatus()).toBe(TaskStatus.EmAndamento)
    task.setStatusConcluido()
    expect(task.getId()).toBe(4)
    expect(task.getTitulo()).toBe('Estudar Java')
    expect(task.getDescricao()).toBe('Ler a documentação oficial do Java')
    expect(task.getTaskStatus()).toBe(TaskStatus.Concluida)
    expect(task.getTaskPrioridade()).toBe(TaskPrioridade.Baixa)
    expect(task.getDataCriacao()).toBe(dataCriacao)
    expect(task.getDataFinal()).toBe(dataFinal)
  })

  it('Deve apresentar um erro ao passar um status diferente de pendente para em andamento', () => {
    const dataCriacao = new Date('2024-03-01')
    const dataFinal = new Date('2025-05-01')
    const task = new Task({
      id: 5,
      titulo: 'Estudar Python',
      descricao: 'Ler a documentação oficial do Python',
      dataCriacao: dataCriacao,
      taskPrioridade: TaskPrioridade.Baixa,
      taskStatus: TaskStatus.Concluida,
      dataFinal: dataFinal,
    })

    expect(task.getId()).toBe(5)
    expect(task.getTitulo()).toBe('Estudar Python')
    expect(task.getDescricao()).toBe('Ler a documentação oficial do Python')
    expect(() => task.setStatusEmAndamento()).toThrow(
      'Apenas tarefas pendentes podem ser iniciadas'
    )
    expect(task.getTaskStatus()).toBe(TaskStatus.Concluida)
    expect(task.getTaskPrioridade()).toBe(TaskPrioridade.Baixa)
    expect(task.getDataCriacao()).toBe(dataCriacao)
    expect(task.getDataFinal()).toBe(dataFinal)
  })

  it('Deve apresentar um erro ao tentar concluir tarefa que não está em andamento', () => {
    const dataCriacao = new Date('2024-03-01')
    const dataFinal = new Date('2025-05-01')
    const task = new Task({
      id: 10,
      titulo: 'Estudar Ruby',
      descricao: 'Ler a documentação oficial do Ruby',
      dataCriacao: dataCriacao,
      taskPrioridade: TaskPrioridade.Baixa,
      taskStatus: TaskStatus.Pendente,
      dataFinal: dataFinal,
    })

    expect(task.getId()).toBe(10)
    expect(task.getTitulo()).toBe('Estudar Ruby')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pendente)
    expect(() => task.setStatusConcluido()).toThrow(
      'Apenas tarefas em andamento podem ser concluidas'
    )
    expect(task.getTaskStatus()).toBe(TaskStatus.Pendente)
    expect(task.getTaskPrioridade()).toBe(TaskPrioridade.Baixa)
  })

  it('Deve permitir alterar o titulo da tarefa', () => {
    const dataCriacao = new Date('2020-06-12')
    const dataFinal = new Date('2025-01-01')
    const task = new Task({
      id: 6,
      titulo: 'Estudar Cshap',
      descricao: 'Ler a documentação oficial do Csharp',
      dataCriacao: dataCriacao,
      taskPrioridade: TaskPrioridade.Baixa,
      taskStatus: TaskStatus.EmAndamento,
      dataFinal: dataFinal,
    })
    expect(task.getTitulo()).toBe('Estudar Cshap')
    task.alteraTituloTask('estudando espanhol')
    expect(task.getId()).toBe(6)
    expect(task.getTitulo()).toBe('estudando espanhol')
    expect(task.getDescricao()).toBe('Ler a documentação oficial do Csharp')
    expect(task.getTaskPrioridade()).toBe(TaskPrioridade.Baixa)
    expect(task.getTaskStatus()).toBe(TaskStatus.EmAndamento)
    expect(task.getDataCriacao()).toBe(dataCriacao)
    expect(task.getDataFinal()).toBe(dataFinal)
  })

  it('Deve apresentar um erro ao alterar titulo para menos de 3 caracteres', () => {
    const dataCriacao = new Date('2020-06-12')
    const dataFinal = new Date('2025-01-01')
    const task = new Task({
      id: 11,
      titulo: 'Estudar Go',
      descricao: 'Ler a documentação oficial do Go',
      dataCriacao: dataCriacao,
      taskPrioridade: TaskPrioridade.Alta,
      taskStatus: TaskStatus.EmAndamento,
      dataFinal: dataFinal,
    })

    expect(task.getId()).toBe(11)
    expect(task.getTitulo()).toBe('Estudar Go')
    expect(() => task.alteraTituloTask('ab')).toThrow(
      'Titulo é obrigatório e deve ter pelo menos 3 caracteres'
    )
    expect(task.getTitulo()).toBe('Estudar Go')
    expect(task.getTaskStatus()).toBe(TaskStatus.EmAndamento)
    expect(task.getDataCriacao()).toBe(dataCriacao)
  })

  it('Deve apresentar um erro ao criar task sem titulo', () => {
    expect(() => {
      new Task({
        id: 12,
        titulo: '',
        descricao: 'Descrição',
      })
    }).toThrow('Titulo é obrigatório e deve ter pelo menos 3 caracteres')
  })

  it('Deve criar uma task sem descrição', () => {
    const task = new Task({
      id: 13,
      titulo: 'Estudar Rust',
    })

    expect(task.getId()).toBe(13)
    expect(task.getTitulo()).toBe('Estudar Rust')
    expect(task.getDescricao()).toBe('')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pendente)
    expect(task.getTaskPrioridade()).toBe(TaskPrioridade.SemPrioridade)
  })

  it('Deve permitir alterar a descrição da tarefa', () => {
    const task = new Task({
      id: 14,
      titulo: 'Estudar Kotlin',
      descricao: 'Descrição inicial',
    })

    expect(task.getDescricao()).toBe('Descrição inicial')
    task.alteraDescricaoTask('Nova descrição')
    expect(task.getDescricao()).toBe('Nova descrição')
  })

  it('Deve criar atributo de data final da task como o padrão', () => {
    const dataAntiga = new Date()
    const dataCriacao = new Date('2025-06-01')
    const task = new Task({
      id: 7,
      titulo: 'Fazer exercícios',
      descricao: 'Resolver problemas medios de programação',
      taskPrioridade: TaskPrioridade.Baixa,
      taskStatus: TaskStatus.Pendente,
      dataCriacao: dataCriacao,
    })
    const dataNova = new Date()

    expect(task.getId()).toBe(7)
    expect(task.getTitulo()).toBe('Fazer exercícios')
    expect(task.getDescricao()).toBe('Resolver problemas medios de programação')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pendente)
    expect(task.getTaskPrioridade()).toBe(TaskPrioridade.Baixa)
    expect(task.getDataFinal().getTime()).toBeLessThanOrEqual(dataNova.getTime())
    expect(task.getDataFinal().getTime()).toBeGreaterThanOrEqual(dataAntiga.getTime())
    expect(task.getDataCriacao()).toBe(dataCriacao)
  })

  it('Deve criar uma task com a prioridade padrão como Sem prioridade', () => {
    const dataCriacao = new Date('2024-06-01')
    const dataFinal = new Date('2025-06-01')
    const task = new Task({
      id: 8,
      titulo: 'Estudar',
      descricao: 'Ler a documentação',
      dataCriacao: dataCriacao,
      taskStatus: TaskStatus.Pendente,
      dataFinal: dataFinal,
    })

    expect(task.getId()).toBe(8)
    expect(task.getTitulo()).toBe('Estudar')
    expect(task.getDescricao()).toBe('Ler a documentação')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pendente)
    expect(task.getTaskPrioridade()).toBe(TaskPrioridade.SemPrioridade)
    expect(task.getDataCriacao()).toBe(dataCriacao)
    expect(task.getDataFinal()).toBe(dataFinal)
  })

  it('Deve criar uma task com o status padrão como Pendente', () => {
    const dataCriacao = new Date('2024-06-01')
    const dataFinal = new Date('2025-06-01')
    const task = new Task({
      id: 9,
      titulo: 'Estudar matemática',
      descricao: 'Ler a documentação',
      dataCriacao: dataCriacao,
      dataFinal: dataFinal,
    })

    expect(task.getId()).toBe(9)
    expect(task.getTitulo()).toBe('Estudar matemática')
    expect(task.getDescricao()).toBe('Ler a documentação')
    expect(task.getTaskStatus()).toBe(TaskStatus.Pendente)
    expect(task.getTaskPrioridade()).toBe(TaskPrioridade.SemPrioridade)
    expect(task.getDataCriacao()).toBe(dataCriacao)
    expect(task.getDataFinal()).toBe(dataFinal)
  })
})

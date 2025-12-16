module.exports = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // Tipos permitidos de commit
    'type-enum': [
      2,
      'always',
      [
        'feat', // nova funcionalidade
        'fix', // correção de bug
        'docs', // documentação
        'style', // formatação (sem alterar lógica)
        'refactor', // refatoração
        'test', // testes
        'chore', // tarefas de manutenção
        'build', // build, deps, configs
        'ci', // CI/CD
        'perf', // melhoria de performance
        'revert', // reverter commit
      ],
    ],

    // Escopo obrigatório (ex: auth, task, user)
    'scope-empty': [2, 'never'],

    // Mensagem curta e clara
    'subject-empty': [2, 'never'],
    'subject-case': [0], // desliga regra chata de case
    'subject-max-length': [2, 'always', 72],

    // Header no tamanho padrão
    'header-max-length': [2, 'always', 100],
  },
}

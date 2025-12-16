# Guia de Contribuição

Obrigado por contribuir!

## 1. Padrão de Commits

Use:
<tipo>: <descrição>

Tipos:

- feat: nova funcionalidade
- fix: correção de bug
- docs: alteração em documentação
- refactor: melhoria interna sem mudar comportamento
- style: ajustes visuais (css, formatação)
- test: testes adicionados
- chore: tarefas internas (configs, build)

Exemplos:
feat: implementa autenticação JWT
fix: corrige erro de CORS no endpoint /login

---

## 2. Antes de enviar o PR

- Rode `npm run lint`
- Rode `npm run format`
- Verifique se nenhum arquivo gerado (`dist/`, `build/`) está sendo commitado.

---

## 3. Estrutura dos diretórios

- `/api`: código backend
- `/web`: frontend
- `/shared`: utilidades, tipos e código compartilhado

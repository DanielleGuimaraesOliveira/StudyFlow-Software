import request from 'supertest'
import app from '../../../serve'

describe('Task Routes Integration', () => {
  describe('Post Routes', () => {
    it.todo('POST /tasks - should create task')
    //   const response = await request(app).post('/tasks').send({ title: 'New title' })
    //   console.log('Response status:', response.status)
    //   console.log('Response body:', response.body)
    //   expect(response.status).toBe(201)
    //   expect(response.body).toMatchObject({ title: 'New title' })
  })

  it.todo('GET /tasks - should list tasks')
  it.todo('GET /tasks/:id - should find task')
  it.todo('PUT /tasks/:id/inicia - should start task')
  it.todo('PUT /tasks/:id/conclui - should finish task')
  it.todo('DELETE /tasks/:id - should delete')
})

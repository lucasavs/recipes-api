const poolMock = jest.fn()


import request from 'supertest'
import app from './app'
import pool from './db/mysql'


jest.mock('./db/mysql', () => ({
  query: poolMock
}))

describe('GET /recipes/{id}', () => {
  it('should get existent recipe', async () => {
    poolMock.mockResolvedValue([[{
      id: 1,
      title: 'mocked title',
      making_time: 'mocked making time',
      serves: 'mocked serves',
      ingredients: 'mocked ingredients',
      cost: 10,
      created_at: Date(),
      Updated_at: Date()
    }]])

    const response = await request(app).get('/recipes/1')
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      {
        message: 'Recipe details by id',
        recipe: [
          {
            id: 1,
            title: 'mocked title',
            making_time: 'mocked making time',
            serves: 'mocked serves',
            ingredients: 'mocked ingredients',
            cost: 10
          }
        ]
      }
    )
    expect(poolMock.mock.calls[0][0]).toBe('SELECT * FROM recipes WHERE id = ?')
    expect(poolMock.mock.calls[0][1]).toEqual([1])
  })
  it('should not find desired recipe', async () => {
    poolMock.mockResolvedValue([[]])

    const response = await request(app).get('/recipes/1')
    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      {
        message: 'No recipe found',
      }
    )
    expect(poolMock.mock.calls[0][0]).toBe('SELECT * FROM recipes WHERE id = ?')
    expect(poolMock.mock.calls[0][1]).toEqual([1])
  })
})

describe('GET /recipes/', () => {
  it('should get all recipes', async () => {
    poolMock.mockResolvedValue([[{
      id: 1,
      title: 'mocked title',
      making_time: 'mocked making time',
      serves: 'mocked serves',
      ingredients: 'mocked ingredients',
      cost: 10,
      created_at: Date(),
      Updated_at: Date()
    },
    {
      id: 2,
      title: 'coxinha',
      making_time: '1 hour',
      serves: '1 person',
      ingredients: 'chicken, dough',
      cost: 100,
      created_at: Date(),
      Updated_at: Date()
    }]])

    const response = await request(app).get('/recipes/')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({

      recipes: [
        {
          id: 1,
          title: 'mocked title',
          serves: 'mocked serves',
          ingredients: 'mocked ingredients',
          making_time: 'mocked making time',
          cost: 10
        },
        {
          id: 2,
          title: 'coxinha',
          serves: '1 person',
          ingredients: 'chicken, dough',
          making_time: '1 hour',
          cost: 100,
        }
      ]
    }
    )
    expect(poolMock.mock.calls[0][0]).toBe('SELECT * FROM recipes')
  })
})

describe('POST /recipes/', () => {
  it('should create new recipe', async () => {
    poolMock.mockResolvedValue([[{
      id: 1,
      title: 'Pudim',
      making_time: '30 min',
      serves: '4 cats',
      ingredients: 'sugar, eggs',
      cost: 30,
      created_at: "today",
      Updated_at: "yesterday"
    }]])

    const response = await request(app).post('/recipes/').send({
      title: 'Pudim',
      making_time: '30 min',
      serves: '4 cats',
      ingredients: 'sugar, eggs',
      cost: 30,
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'Recipe successfully created!',
      recipe: [
        {
          id: 1,
          title: 'Pudim',
          making_time: '30 min',
          serves: '4 cats',
          ingredients: 'sugar, eggs',
          cost: 30,
          created_at: "today"
        },
        
      ]
    })
    expect(poolMock.mock.calls[1][0]).toBe('INSERT INTO recipes (title, making_time, serves, ingredients, cost) VALUES (?, ?, ?, ?, ?)')
    expect(poolMock.mock.calls[1][1]).toEqual(['Pudim', '30 min', '4 cats', 'sugar, eggs', 30])
        
  })
  it('should have validation errors', async () => {
    const response = await request(app).post('/recipes/').send({
      making_time: '30 min',
      ingredients: 'sugar, eggs',
      cost: 30,
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'Recipe creation failed!',
      required: ['title', 'serves']
    })
  })
})

describe('DELETE /recipes/{id}', () => {
  it('should delete recipe', async () => {
    poolMock.mockResolvedValue([{
      affectedRows: 1
    }])

    const response = await request(app).delete('/recipes/1')
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      {
        message: 'Recipe succesfully removed!',
      }
    )

    expect(poolMock.mock.calls[0][0]).toBe('DELETE FROM recipes WHERE id = ?')
    expect(poolMock.mock.calls[0][1]).toEqual([1])

  })
  it('should not find recipe', async () => {
    poolMock.mockResolvedValue([{
      affectedRows: 0
    }])


    const response = await request(app).delete('/recipes/1')
    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      {
        message: 'No recipe found',
      }
    )
    expect(poolMock.mock.calls[0][0]).toBe('DELETE FROM recipes WHERE id = ?')
    expect(poolMock.mock.calls[0][1]).toEqual([1])
  })
})

describe('PATCH /recipes/{id}', () => {
  it('should update recipe', async () => {
    poolMock.mockResolvedValueOnce({}) //start transaction
      .mockResolvedValueOnce([[{
        id: 1,
        title: 'feijoada',
        making_time: '2 days',
        serves: 'a lot of people',
        ingredients: 'beans, pork',
        cost: 100,
        created_at: Date(),
        Updated_at: Date()
      }]]) //select old value
      .mockResolvedValueOnce({}) //insert new value
      .mockResolvedValueOnce(
        [[{
          id: 1,
          title: 'feijoada',
          making_time: '3 days',
          serves: 'a lot of people',
          ingredients: 'beans, pork',
          cost: 300,
          created_at: Date(),
          Updated_at: Date()
        }]]) // return updated value

    const response = await request(app).patch('/recipes/1').send({
      cost: 300,
      making_time: '3 days',
    }
    )
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      {
        message: 'Recipe successfully updated!',
        recipe: [
          {
            id: 1,
            title: 'feijoada',
            making_time: '3 days',
            serves: 'a lot of people',
            ingredients: 'beans, pork',
            cost: 300,
          }
        ]
      }
    )
    expect(poolMock.mock.calls[1][0]).toBe('SELECT * FROM recipes WHERE id= ?')
    expect(poolMock.mock.calls[1][1]).toEqual([1])
    expect(poolMock.mock.calls[2][0]).toBe('UPDATE recipes SET title = ?, making_time = ?, serves = ?, ingredients = ?, cost = ? WHERE id = ?')
    expect(poolMock.mock.calls[2][1]).toEqual(['feijoada', '3 days', 'a lot of people', 'beans, pork', 300, 1])
  })
  it('should not find recipe', async () => {
    poolMock.mockResolvedValue([[]])

    const response = await request(app).patch('/recipes/1').send({
      cost: 300,
      making_time: '3 days',
    }
    )

    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      {
        message: 'No recipe found',
      }
    )
    expect(poolMock.mock.calls[1][0]).toBe('SELECT * FROM recipes WHERE id= ?')
    expect(poolMock.mock.calls[1][1]).toEqual([1])
  })
})
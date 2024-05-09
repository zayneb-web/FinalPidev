const request = require('supertest');
const app = require('./server'); 
const { User } = require('./Models/user');

describe('User APIs', () => {
  let authToken; 

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/auth/login') 
      .send({ email: 'mohamedamine.abdessayed@esprit.tn', password: 'test' }); 
    authToken = loginResponse.body.token; 
  });

  it('should get all users', async () => {
    const response = await request(app)
      .get('/users/allUsers')
      .set('Authorization', `Bearer ${authToken}`); 
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('users');
  }, 10000); 

});

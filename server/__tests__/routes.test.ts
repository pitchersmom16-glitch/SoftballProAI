import request from 'supertest';
import app from '../index';

describe('API routes', () => {
  it('GET /api/player/athlete returns 200', async () => {
    const res = await request(app).get('/api/player/athlete');
    expect(res.status).toBe(200);
  });
});
const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const express = require('express');

// Simple mock app for testing
const app = express();
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

test('API Basic Tests', async (t) => {
  await t.test('should return health status', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.body, { status: 'ok' });
  });
});

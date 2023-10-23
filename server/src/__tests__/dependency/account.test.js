import request from 'supertest';
import app from '../../index.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'server/src/constants';
import nodemailer from 'nodemailer';
import sinon from 'sinon';

describe('Test /forget-password endpoint', function() {
  let userEmail = 'test@example.com';
  let mockTransporter = {
    sendMail: sinon.stub().resolves()
  };

  before(function() {
    sinon.stub(jwt, 'sign').returns('validToken');
    sinon.stub(nodemailer, 'createTransport').returns(mockTransporter);
    // Here you should also mock the MySQL query
  });

  after(function() {
    jwt.sign.restore();
    nodemailer.createTransport.restore();
    // Also restore the MySQL query here
  });

  it('should send a reset password email', async function() {
    const response = await request(app).post('/forget-password').send({ email: userEmail });
    response.expect(200);
    sinon.assert.calledWith(jwt.sign, sinon.match({ email: userEmail }), JWT_SECRET, { expiresIn: '1h' });
    sinon.assert.calledWith(nodemailer.createTransport, sinon.match.any);
    sinon.assert.calledWith(mockTransporter.sendMail, sinon.match.has('to', userEmail));
    // Verify the MySQL query here
  });
});


// This test does the following:
// Mocks the JWT signing method to always return a valid token.
// Mocks the nodemailer transporter to simulate a successful email send operation.
// Sends a POST request to the /forget-password endpoint with a user email.
// Verifies the HTTP response status code.
// Checks if JWT sign method was called with correct parameters.
// Checks if nodemailer's sendMail method was called with the correct email.
// Remember you also need to mock and verify the MySQL query as your API also has a dependency on the DB which needs to be tested.
// Please replace the yourApp with your actual Express application. 
//Also, this is a simple test and in a real application, 
//you would need to handle more test cases like when DB or email sending fails. 
//You might also need to consider using a different testing approach/tool if your application is not using Express.
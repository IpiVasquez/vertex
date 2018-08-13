import { expect } from 'chai';
import * as chai from 'chai';

import { MongoUser, User } from 'api/auth/models';
import { metapos, testUser } from '../config';

const chaiHttp = require('chai-http');
const route = '/api/auth/register/local';

chai.use(chaiHttp);

describe('Register controller', () => {
  let user: MongoUser;

  before(async () => {
    // Create user before start tests
    user = await User.create(testUser);
  });

  after(async () => {
    // Delete use after tests
    await User.deleteOne({ email: user.email });
  });

  it('should report existing user', async () => {
    const res = await chai
      .request(metapos.app)
      .post(route)
      .send({
        email: testUser.email,
        password: testUser.password,
        name: testUser.profile.name
      });
    expect(res.status).to.equals(400);
    const jsonRes = JSON.parse(res.text);
    expect(jsonRes.type).to.equal('Registration error');
    expect(jsonRes.message).to.equal('User already registered');
  });

  it('should report inconsistent data', async () => {
    const res = await chai
      .request(metapos.app)
      .post(route)
      .send({
        email: testUser.email,
        password: testUser.password
      });
    expect(res.status).to.equals(400);
    const jsonRes = JSON.parse(res.text);
    expect(jsonRes.type).to.equal('Registration error');
    expect(jsonRes.message).to.equal('Inconsistent data');
  });

  it('should register user', async () => {
    const customUser = {
      email: 'clarkk@dailyplanet.com',
      password: 'luisalane',
      name: 'Clark Kent'
    };
    const res = await chai
      .request(metapos.app)
      .post(route)
      .send(customUser);
    expect(res.status).to.equals(201);
    const jsonRes = JSON.parse(res.text);
    expect(jsonRes.message).to.equal('OK');
    const clark = await User.findOne({ email: customUser.email });
    expect(clark.email).to.equal(customUser.email);
    expect(clark.profile.name).to.equal(customUser.name);
    // @ts-ignore
    expect(await clark.checkPassword(customUser.password)).to.equal(true);
    await clark.remove();
  });
});

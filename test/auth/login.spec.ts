import * as decode from 'jwt-decode';
import { expect } from 'chai';
import * as chai from 'chai';

import { MongoUser, User } from 'api/auth/models';
import { metapos, testUser } from '../config';

const chaiHttp = require('chai-http');
const route = '/api/auth/login/local';

chai.use(chaiHttp);

describe('Login controller', () => {
  let user: MongoUser;

  before(async () => {
    // Create user before start tests
    user = await User.create(testUser);
  });

  after(async () => {
    // Delete use after tests
    await User.deleteOne({ email: user.email });
  });

  it('should log user in & receive a valid auth token', async () => {
    const res = await chai
      .request(metapos.app)
      .post(route)
      .send({
        email: 'b@wayne.com',
        password: 'secreto'
      });
    expect(res.status).to.equals(200);
    const jsonRes = JSON.parse(res.text);
    expect(typeof jsonRes.token).to.equals('string');
    const payload = <any>decode(jsonRes.token);
    expect(payload.email).to.equal(user.email);
    expect(payload.sub).to.equal(String(user._id));
  });

  it(`should report 'User not found'`, async () => {
    const res = await chai
      .request(metapos.app)
      .post(route)
      .send({
        email: 'b@wayne.co',
        password: 'secret'
      });
    expect(res.status).to.equals(401);
    const jsonRes = JSON.parse(res.text);
    expect(jsonRes.type).to.equal('Authorization error');
    expect(jsonRes.message).to.equal('User not found');
  });

  it(`should report 'Wrong password'`, async () => {
    const res = await chai
      .request(metapos.app)
      .post(route)
      .send({
        email: 'b@wayne.com',
        password: 'secret'
      });
    expect(res.status).to.equals(401);
    const jsonRes = JSON.parse(res.text);
    expect(jsonRes.type).to.equal('Authorization error');
    expect(jsonRes.message).to.equal('Wrong password');
  });
});

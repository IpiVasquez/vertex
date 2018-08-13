import * as decode from 'jwt-decode';
import { expect } from 'chai';
import * as chai from 'chai';

import { MongoUser, User } from 'api/auth/models';
import { metapos, testUser } from '../config';

const chaiHttp = require('chai-http');
const route = '/api/users';

chai.use(chaiHttp);

describe('Authenticator', () => {
  let user: MongoUser;
  let sei: number;

  before(async () => {
    // Create user before start tests
    await User.create(testUser);
    user = await User.findOne({ email: testUser.email });
  });

  after(async () => {
    // Delete use after tests
    await User.deleteOne({ email: user.email });
  });

  it('should report a malformed token', async () => {
    const res = await chai
      .request(metapos.app)
      .get(route)
      .set('authorization', 'LOL!');
    expect(res.status).to.equals(401);
    const jsonRes = JSON.parse(res.text);
    expect(jsonRes.type).to.equals('Authentication error');
    expect(jsonRes.message).to.equals('jwt malformed');
  });

  it('should report an expired token', async () => {
    sei = user.settings.expiry;
    // Expire token after just one second
    user.settings.expiry = 1;
    await user.save();
    const token = user.tokenize();
    user.settings.expiry = sei;
    await user.save();
    // Waiting 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
    const res = await chai
      .request(metapos.app)
      .get(route)
      .set('authorization', token);
    expect(res.status).to.equals(401);
    const jsonRes = JSON.parse(res.text);
    expect(jsonRes.type).to.equals('Authentication error');
    expect(jsonRes.message).to.equals('jwt expired');
  });

  it('should respond normally', async () => {
    // @ts-ignore
    const token = user.tokenize();
    const res = await chai.request(metapos.app).get(route);
    // No token in the response
    expect(res.header.authorization).to.equals(undefined);
    expect(res.status).to.equals(200);
  });

  it('should authenticate & update token', async () => {
    // @ts-ignore
    const token = user.tokenize();
    const res = await chai
      .request(metapos.app)
      .get(route)
      .set('authorization', token);
    // Token payload must contain user
    const payload = <any>decode(res.header.authorization);
    expect(res.status).to.equals(200);
    expect(payload.email).to.equal(user.email);
    expect(payload.sub).to.equal(String(user._id));
    // @ts-ignore
    const tokenUser = await User.detokenize(res.header.authorization);
    expect({
      email: user.email,
      profile: user.profile,
      settings: user.settings
    }).to.eqls({
      email: tokenUser.email,
      profile: tokenUser.profile,
      settings: tokenUser.settings
    });
  });
});

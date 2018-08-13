import { expect } from 'chai';
import * as chai from 'chai';

import { metapos } from './config';
import { Metapos } from 'api/app';

const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('MetaPOS', () => {
  it('should be a MetaPOS app', async () => {
    expect(metapos instanceof Metapos).to.equals(true);
  });
});

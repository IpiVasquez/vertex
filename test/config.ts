import * as dotenv from 'dotenv';
import * as path from 'path';
// Before everything
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
process.env.NODE_ENV = 'test';

import { Metapos } from 'api/app';

export const metapos = new Metapos(process.env.MONGO_URI);
export const testUser: any = {
  email: 'b@wayne.com',
  profile: {
    name: 'Bruce',
    lastName: 'Wayne',
    pictureUrl: 'None!'
  },
  settings: {
    locale: 'en',
    sessionExpiresIn: 1
  },
  password: 'secreto'
};

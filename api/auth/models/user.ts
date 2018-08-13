import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs'; // TODO: Ensure this encryption really works

import { masterLogger } from 'api/lib';

const logger = masterLogger.getLogger('auth:user', 'model');

const secret = process.env.SECRET;
const SALT_WORK_FACTOR = 10;
const defaultExpiry = 24 * 3600; // 24hrs

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    profile: {
      name: { type: String, required: true },
      lastName: { type: String, default: '' },
      image: { type: String, default: '' },
      teamId: { type: Number }
    },
    settings: {
      expiry: { type: Number, default: defaultExpiry }, // Session expire
      locale: { type: String, default: 'es' }
    },
    password: { type: String } // TODO: What happens?
  },
  { timestamps: true }
).pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    logger.debug('Generating salt');
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    logger.debug('Generating hash');
    // @ts-ignore
    const hash = await bcrypt.hash(this.password, salt);
    logger.debug('Saving password');
    // @ts-ignore
    this.password = hash;
    next();
  } catch (e) {
    logger.error(e.message, { error: e });
    next(e);
  }
});

/**
 * Checks the password provided matches the user password.
 */
userSchema.methods.checkPassword = async function(password: string) {
  logger.debug('Comparing password');
  try {
    const match = await bcrypt.compare(password, this.password);
    return match;
  } catch (e) {
    logger.error(e.message, { error: e });
    return false;
  }
};

/**
 * Transforms this user into a jwt.
 */
userSchema.methods.tokenize = function(): string {
  const token = jwt.sign(
    {
      // iss: 'MetaPOS', // The issuer of the token
      sub: this._id, // The subject of the token
      email: this.email,
      profile: this.profile,
      settings: this.settings
    },
    secret,
    {
      expiresIn: this.settings.expiry
    }
  );
  logger.debug(this.email + ' tokenized');
  return token;
};

/**
 * Verifies the token provided, then retrieves user from the it.
 * @param token Token generated by user.tokenize.
 */
userSchema.statics.detokenize = async function(token: string) {
  logger.debug('Detokenizing');
  const user = jwt.verify(token, secret);
  logger.debug('Searching');
  // @ts-ignore
  return await this.findById(user.sub);
};

export type MongoUser = Model.User & mongoose.Document;

export const User = mongoose.model<MongoUser>('users', userSchema);
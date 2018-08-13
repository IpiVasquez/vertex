require('dotenv').config();

const PROXY_CONFIG = {
  '/api/*': {
    target: process.env.API || 'http://localhost:3000',
    secure: false,
    logLevel: 'debug'
  }
};

module.exports = PROXY_CONFIG;

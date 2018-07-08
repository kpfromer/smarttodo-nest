import * as Confidence from 'confidence';

const constants = {
  APP_TITLE: 'Smarttodo',
  CLIENT_URL: 'https://smarttodo.com',
  PORT: 3000
};

const config = {
  port: {
    $filter: 'env',
    production: process.env.PORT,
    $default: constants.PORT
  },
  databaseUrl: {
    $filter: 'env',
    production: process.env.MONGO_URL,
    $default: 'mongodb://localhost/smarttodo-nest'
  },
  jwtSecret: {
    $filter: 'env',
    production: process.env.JWT_SECRET,
    $default: 'DEVJWTSECRET'
  },
  saltNumber: 10,
  jwtExpire: 3600
};

const criteria = {
  env: process.env.NODE_ENV
};

const store = new Confidence.Store(config);

export const Config = new class {
  get(key: string) {
    return store.get(key, criteria);
  }

  getMetadata(key: string) {
    return store.meta(key, criteria);
  }
}();
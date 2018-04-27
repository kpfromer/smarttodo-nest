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
  saltNumber: 10
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
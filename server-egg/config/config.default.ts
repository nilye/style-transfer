import * as dotenv from 'dotenv';
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { VerifyJwtOptions } from '../app/middleware/verifyJwt';


export default (appInfo: EggAppInfo) => {
  const envConfig = dotenv.config().parsed || {};

  const config = {
    ...envConfig,
    env: envConfig.NODE_ENV || 'dev',
  } as PowerPartial<EggAppConfig & {
    verifyJwt: VerifyJwtOptions
  }>;


  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = envConfig?.ACCESS_KEY_SECRET || appInfo.name;

  // add your egg config in here
  config.middleware = [ 'verifyJwt' ];
  config.verifyJwt = {
    secret: envConfig.AUTH_SECRET,
    passThrough: [ '/auth/sign', '/', '/wx/callback' ],
  };


  // on error


  // the return config will combines to EggAppConfig
  return {
    ...config,
    bodyParser: {
      enableTypes: [ 'json', 'xml' ],

    },
    cors: {
      origin: '*',
      allowMethods: '*',
      allowHeaders: [ 'Content-Type', 'Origin', 'Accept', 'Authorization' ],
    },
    security: {
      csrf: {
        enable: false,
      },
    },
    cluster: {
      listen: {
        port: 3100,
        hostname: '127.0.0.1',
      },
    },
  };
};

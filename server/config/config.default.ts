import * as dotenv from 'dotenv';
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';


export default (appInfo: EggAppInfo) => {
  const envConfig = dotenv.config().parsed;

  const config = {
    ...envConfig,
  } as PowerPartial<EggAppConfig>;


  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = envConfig?.ACCESS_KEY_SECRET || appInfo.name;

  // add your egg config in here
  config.middleware = [];


  // on error


  // the return config will combines to EggAppConfig
  return {
    ...config,
    cluster: {
      listen: {
        port: 3100,
      },
    },
  };
};

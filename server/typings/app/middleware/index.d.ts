// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportVerifyJwt from '../../../app/middleware/verifyJwt';

declare module 'egg' {
  interface IMiddleware {
    verifyJwt: typeof ExportVerifyJwt;
  }
}

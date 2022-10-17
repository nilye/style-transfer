// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuth from '../../../app/controller/auth';
import ExportBase from '../../../app/controller/base';
import ExportHome from '../../../app/controller/home';
import ExportOss from '../../../app/controller/oss';

declare module 'egg' {
  interface IController {
    auth: ExportAuth;
    base: ExportBase;
    home: ExportHome;
    oss: ExportOss;
  }
}

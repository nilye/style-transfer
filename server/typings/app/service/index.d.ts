// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportAuth from '../../../app/service/auth';
import ExportOss from '../../../app/service/oss';
import ExportTest from '../../../app/service/Test';
import ExportWx from '../../../app/service/wx';

declare module 'egg' {
  interface IService {
    auth: AutoInstanceType<typeof ExportAuth>;
    oss: AutoInstanceType<typeof ExportOss>;
    test: AutoInstanceType<typeof ExportTest>;
    wx: AutoInstanceType<typeof ExportWx>;
  }
}

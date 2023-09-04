import { Controller as BaseController } from 'egg';
import ResponseCode from '../util/repsonseCode';

class Controller extends BaseController {

  success(data) {
    this.ctx.body = {
      code: ResponseCode.OK,
      message: 'success',
      data,
    };
    this.ctx.status = 200;
  }

  badRequest(code = ResponseCode.BAD_REQUEST, message = 'bad request') {
    this.ctx.body = {
      code,
      message,
    };
    this.ctx.status = 400;
  }

  unauthorized() {
    this.ctx.body = {
      code: ResponseCode.UNAUTORIZED,
      message: 'unauthorized',
    };
    this.ctx.status = 401;
  }

}

export default Controller;

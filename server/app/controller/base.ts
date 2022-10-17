import { Controller as BaseController } from 'egg';

class Controller extends BaseController {

  success(data) {
    this.ctx.body = {
      code: 0,
      message: 'success',
      data,
    };
  }

  badRequest(code = 1, message = 'bad request') {
    this.ctx.body = {
      code,
      message,
    };
  }

  unauthorize() {
    this.ctx.body = {
      code: 2,
      message: 'unauthorized',
    };
  }

}

export default Controller;

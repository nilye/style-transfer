import Controller from './base';

export default class AuthController extends Controller {
  public async sign() {
    const { ctx, config } = this;

    ctx.validate({
      id: {
        type: 'int',
        required: false,
      },
      secret: 'string',
    });

    const { secret, id } = ctx.request.body;
    if (secret !== config.AUTH_SECRET) {
      this.unauthorize();
    }

    const token = ctx.service.auth.signJwt(id || 1);

    this.success({ token });
  }
}


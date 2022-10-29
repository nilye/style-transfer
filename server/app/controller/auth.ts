import Controller from './base';


export default class AuthController extends Controller {
  public async sign() {
    const { ctx, config } = this;

    ctx.validate({
      // bucket name
      bucket: {
        type: 'string',
        required: true,
      },
      // client name
      client: {
        type: 'string',
        required: true,
      },
      secret: {
        type: 'string',
        required: false,
      },
    });

    const { secret, bucket, client } = ctx.request.body;
    const bucketList = ctx.service.oss.bucketList;
    if (bucket !== bucketList.dev ||
      (bucket !== bucketList.prod &&
        secret !== config.AUTH_SECRET)
    ) {
      this.unauthorized();
    }

    const token = ctx.service.auth.signJwt(bucket, client);
    ctx.cookies.set('token', token, {
      maxAge: 1000 * 3600 * 24 * 365 * 5, // 5yr
      signed: true,
      httpOnly: false,
    });

    this.success({ token });
  }

  public async verify() {
    this.success(null);
  }
}


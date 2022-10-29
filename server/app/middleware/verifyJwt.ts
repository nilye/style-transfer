import jwt from 'jsonwebtoken';
import ResponseCode from '../util/repsonseCode';

export interface VerifyJwtOptions {
  secret?: string,
  passThrough?: string[]
}

export default function(options: VerifyJwtOptions = {}) {

  const { secret, passThrough = [] } = options;

  return async function verifyJwt(ctx, next) {

    const path = ctx.request.path;
    if (passThrough.includes(path)) {
      return await next();
    }

    const token = ctx.req.headers.authorization ||
    ctx.cookies.get('token', { signed: false });

    try {
      const decoded = jwt.verify(token, secret);
      if (!decoded?.bucket || !decoded?.client) {
        throw new Error();
      }
      ctx.state.user = decoded;
    } catch (err) {
      ctx.body = {
        code: ResponseCode.UNAUTORIZED,
        message: 'unauthorized',
      };
      ctx.status = 401;
      return;
    }

    await next();
  };
}

import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  router.post('/auth/sign', controller.auth.sign);
  router.post('/oss/sign', controller.oss.sign)
};

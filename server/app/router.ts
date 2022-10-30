import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  router.post('/auth/sign', controller.auth.sign);
  router.get('/auth/verify', controller.auth.verify);

  router.post('/oss/sign', controller.oss.sign);
  router.post('/oss/createUpload', controller.oss.createUpload);

  router.post('/wx/qrcode', controller.wx.stQrcode);
};

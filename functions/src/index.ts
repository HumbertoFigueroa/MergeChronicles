/const functions = require('firebase-functions');
const next = require('next');

const app = next({
  dev: false,
  conf: { distDir: './.next' }
});
const handle = app.getRequestHandler();

exports.nextApp = functions.https.onRequest((req: any, res: any) => {
  return app.prepare().then(() => handle(req, res));
});

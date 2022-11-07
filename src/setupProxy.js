const proxy = require('http-proxy-middleware');

module.exports = app => {
  if (process.env.REACT_APP_PROXY) {
    app.use(proxy('/enterprise', { target: process.env.REACT_APP_PROXY }));
  }
};

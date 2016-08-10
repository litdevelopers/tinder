const httpTransport = require('https');
const responseEncoding = 'utf8';

const getFBToken = (cookie, dtsg, userID, callback) => {
  const httpOptions = {
    hostname: 'www.facebook.com',
    port: '443',
    path: '/v2.6/dialog/oauth/confirm?dpr=1',
    method: 'POST',
    headers: {
      Cookie: cookie,
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
  };
  httpOptions.headers['User-Agent'] = `node ${process.version}`;

// Paw Store Cookies option is not supported

  const request = httpTransport.request(httpOptions, (res) => {
    const responseBufs = [];
    let responseStr = '';

    res.on('data', (chunk) => {
      if (Buffer.isBuffer(chunk)) {
        responseBufs.push(chunk);
      } else {
        responseStr = responseStr + chunk;
      }
    }).on('end', () => {
      responseStr = responseBufs.length > 0 ?
          Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;
      callback(null, res.statusCode, res.headers, responseStr);
    });
  })
.setTimeout(0)
.on('error', (error) => {
  callback(error);
});
  request.write(`fb_dtsg=${dtsg}&app_id=464891386855067&redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&display=page&return_format=access_token`);
  request.end();
};

module.exports = {
  getFBToken,
};

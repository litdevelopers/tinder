const request = require('superagent');

function getFBToken(cookie, dtsg) {
  return new Promise((resolve, reject) => {
    request
    .post('https://www.facebook.com/v2.6/dialog/oauth/confirm?dpr=1')
    .set('Cookie', cookie)
    .set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
    .set('User-Agent', 'Mozilla/5.0 (Linux; U; en-gb; KFTHWI Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.16 Safari/535.19')
    .send(`fb_dtsg=${dtsg}&app_id=464891386855067&redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&display=page&return_format=access_token`)
    .end((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.text);
      }
    });
  });
}

module.exports = {
  getFBToken,
};

const request = require('superagent');

// function getFBToken(cookie, dtsg) {
//   return new Promise((resolve, reject) => {
//     request
//     .post('https://www.facebook.com/v2.6/dialog/oauth/confirm?dpr=1')
//     .set('Cookie', cookie)
//     .set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
//     .set('User-Agent', 'Mozilla/5.0 (Linux; U; en-gb; KFTHWI Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.16 Safari/535.19')
//     .send(`fb_dtsg=${dtsg}&app_id=464891386855067&redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&display=page&return_format=access_token`)
//     .end((err, res) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(res.text);
//       }
//     });
//   });
// }

function getFBToken(data) {
  return new Promise((resolve, reject) => {
    const tokenPattern = /access_token=(.*)&/;
    const token = data.match(tokenPattern)[1];
    if (token) {
      resolve(token);
    } else {
      reject('Token error');
    }
    // const expirationPattern = /expires_in=(.*)/;
    // const expiration = parseInt(result.match(expirationPattern)[1]);
    // const now = Date.now();
    // const expiryTime = new Date(now + (1000 * expiration));
  });
}

function getFBUserId(token) {
  return new Promise((resolve, reject) => {
    const graphUrl = `https://graph.facebook.com/me?access_token=${token}`;
    request.get(graphUrl)
      .end((err, res) => {
        if (err || !res.ok) {
          reject('Superagent error');
        } else {
          resolve(JSON.parse(res.text).id);
        }
      });
  });
}

function returnFacebook(data) {
  const token = getFBToken(data);
  const fbid = token.then((fbtoken) => getFBUserId(fbtoken));
  return Promise.all([token, fbid]);
}
module.exports = {
  getFBToken,
  getFBUserId,
  returnFacebook,
};

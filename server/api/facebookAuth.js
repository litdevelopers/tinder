const request = require('superagent');

function getFBToken(data) {
  return new Promise((resolve, reject) => {
    const tokenPattern = /access_token=(.*)&/;
    const token = data.match(tokenPattern)[1];
    if (token) {
      resolve(token);
    } else {
      reject('Token error');
    }
    // Keep code in case we want to start storing statically
    // const expirationPattern = /expires_in=(.*)/;
    // const expiration = parseInt(result.match(expirationPattern)[1]);
    // const now = Date.now();
    // const expiryTime = new Date(now + (1000 * expiration));
  });
}

// Keep code in case in future we need fbid again
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

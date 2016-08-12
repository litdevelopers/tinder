const router = require('express').Router(); // eslint-disable-line new-cap
const tinder = require('tinder');
const tinderPromise = require('./promiseTinder.js');
const nightmare = require('nightmare');
const getFBToken = require('./facebookAuth.js').getFBToken;

const FACEBOOK_URL = 'https://www.facebook.com/v2.6/dialog/oauth?redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&state=%7B%22challenge%22%3A%22q1WMwhvSfbWHvd8xz5PT6lk6eoA%253D%22%2C%220_auth_logger_id%22%3A%2254783C22-558A-4E54-A1EE-BB9E357CC11F%22%2C%22com.facebook.sdk_client_state%22%3Atrue%2C%223_method%22%3A%22sfvc_auth%22%7D&scope=user_birthday%2Cuser_photos%2Cuser_education_history%2Cemail%2Cuser_relationship_details%2Cuser_friends%2Cuser_work_history%2Cuser_likes&response_type=token%2Csigned_request&default_audience=friends&return_scopes=true&auth_type=rerequest&client_id=464891386855067&ret=login&sdk=ios&logger_id=54783C22-558A-4E54-A1EE-BB9E357CC11F#_= ';

router.post('/auth/facebook', (req, res) => {
  const n = nightmare({ typeInterval: 1, webPreferences: { partition: 'noflexzone', images: false, nodeIntegration: false }, show: true });
  n
  .goto(FACEBOOK_URL)
  .type('input[name="email"]', req.body.login)
  .type('input[name="pass"]', req.body.password)
  .click('button[name="login"]')
  .wait('button[name="__CONFIRM__"]')
  .click('button[name="__CONFIRM__"]')
  .evaluate(() => document.querySelector('input[name="fb_dtsg"]').value)
  .then((fbdtsg) => {
    n
    .cookies.get({ url: null })
    .end()
    .then((cookies) => {
      const cookieArray = cookies.map((each) => `${each.name}=${each.value};`);
      const requiredID = cookies.filter((each) => each.name === 'c_user')[0].value;
      getFBToken(cookieArray.join(' '), fbdtsg, requiredID, (error, statusCode, headers, body) => {
        if (error) {
          res.status(400).json(error);
        } else {
          const client = new tinder.TinderClient();
          const facebookToken = body.match(/access_token=(.+)&/)[0].split(/=|&/)[1];
          client.authorize(facebookToken, 0, () => {
            res.status(200).json({ authToken: client.getAuthToken(), fbToken: facebookToken });
          });
        }
      });
    });
  });
});

router.post('/tinder/data', (req, res) => {
  const fbtoken = req.body.token;
  const client = new tinder.TinderClient();
  client.authorize(fbtoken, 0, () => {
    Promise.all([
      tinderPromise.getDefaults(client),
      tinderPromise.getHistory(client),
      tinderPromise.getRecommendations(client),
      tinderPromise.getAuthToken(client),
    ])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  });
});

router.post('/tinder/like', (req, res) => {
  const likeUser = req.body.likeUserId;
  const xAuth = req.body.userToken;
  const client = new tinder.TinderClient();

  client.setAuthToken(xAuth);
  tinderPromise.likePerson(client, likeUser)
  .then((response) => {
    res.status(200).json(response);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.post('/tinder/pass', (req, res) => {
  const passUser = req.body.passUserId;
  const xAuth = req.body.userToken;
  const client = new tinder.TinderClient();

  client.setAuthToken(xAuth);
  tinderPromise.passPerson(client, passUser)
  .then((response) => {
    res.status(200).json(response);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.post('/tinder/superlike', (req, res) => {
  const likeUser = req.body.superlikeUserId;
  const xAuth = req.body.userToken;
  const client = new tinder.TinderClient();

  client.setAuthToken(xAuth);
  tinderPromise.superLikePerson(client, likeUser)
  .then((response) => {
    res.status(200).json(response);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.post('/tinder/matches', (req, res) => {
  const xAuth = req.body.authToken;
  const client = new tinder.TinderClient();

  client.setAuthToken(xAuth);
  tinderPromise.getRecommendations(client)
  .then((response) => res.status(200).json(response))
  .catch((error) => res.status(400).json(error));
});

router.post('/tinder/updates', (req, res) => {
  const xAuth = req.body.authToken;
  const client = new tinder.TinderClient();

  client.setAuthToken(xAuth);
  tinderPromise.getUserUpdates(client)
  .then((response) => res.status(200).json(response))
  .catch((error) => res.status(400).json(error));
});


module.exports = router;

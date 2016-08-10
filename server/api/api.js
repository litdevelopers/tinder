const router = require('express').Router(); // eslint-disable-line new-cap
const tinder = require('tinder');
const client = new tinder.TinderClient();
const tinderPromise = require('./promiseTinder.js');

/*
NEW AUTH FLOW BECAUSE I BROKE THE OLD ONE:
1) Go to Facebook.com.
2) If I can find an element for my profile picture, I know im in the right place.
2 - 1) If I can, I will go to the FACEBOOK_AUTH_URL
2 - 2) Done
3) If I cannot find my profile picture, I will go to facebook.com and login
3 - 1) I will then retrieve my profile id
3 - 2) I will THEN go on the website for oauth



*/
const FACEBOOK_AUTH_URL = 'https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token';
const FACEBOOK_URL = 'https://facebook.com';

router.post('/auth/facebook', (req, res) => {
  const nightmare = require('nightmare'); // eslint-disable-line 
  const n = nightmare({ show: true, typeInterval: 20, webPreferences: { partition: 'noflexzone' } });

  n
    .goto(FACEBOOK_AUTH_URL)
    .exists('form[id="login_form"]')
    .then((formExists) => {
      if (!formExists) {
        n
          .url()
          .then((noLoginUrl) => {
            n
            .goto(FACEBOOK_URL)
            .evaluate(() => document.querySelector('a[title="Profile"] img').id.split('_').reverse()[0])
            .end()
            .then((profileId) => {
              res.status(200).json({
                token: noLoginUrl.split(/access_token=|&expires_in/)[1],
                id: profileId,
              });
            });
          });
      } else {
        n
          .type('input[name="email"]', req.body.login)
          .type('input[name="pass"]', req.body.password)
          .click('button[id="loginbutton"]')
          .wait(200)
          .url()
          .then((loginURL) => {
            n
            .goto(FACEBOOK_URL)
            .type('input[name="email"]', req.body.login)
            .type('input[name="pass"]', req.body.password)
            .click('input[type="submit"]')
            .evaluate(() => document.querySelector('a[title="Profile"] img').id.split('_').reverse()[0])
            .end()
            .then((profileId) => {
              res.status(200).json({
                token: loginURL.split(/access_token=|&expires_in/)[1],
                id: profileId,
              });
            });
          });
      }
    });
});

router.post('/tinder/data', (req, res) => {
  const token = req.body.token;
  const id = req.body.id;

  client.authorize(token, id, () => {
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
  const userToken = req.body.userToken;
  const userId = req.body.userId;
  const likeUser = req.body.likeUserId;

  client.authorize(userToken, userId, () => {
    tinderPromise.likePerson(client, likeUser)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  });
});

router.post('/tinder/pass', (req, res) => {
  const userToken = req.body.userToken;
  const userId = req.body.userId;
  const passUser = req.body.passUserId;
  console.log('Passing');

  client.authorize(userToken, userId, () => {
    tinderPromise.passPerson(client, passUser)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  });
});

router.post('/tinder/superlike', (req, res) => {
  const userToken = req.body.userToken;
  const userId = req.body.userId;
  const likeUser = req.body.superlikeUserId;

  client.authorize(userToken, userId, () => {
    tinderPromise.superLikePerson(client, likeUser)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  });
});

router.post('/tinder/matches', (req, res) => {
  const userToken = req.body.userToken;
  const userId = req.body.userId;

  client.authorize(userToken, userId, () => {
    tinderPromise.getRecommendations(client)
    .then((response) => res.status(200).json(response))
    .catch((error) => res.status(400).json(error));
  });
});


module.exports = router;

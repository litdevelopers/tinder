const router = require('express').Router(); // eslint-disable-line new-cap
const tinder = require('tinder');
const client = new tinder.TinderClient();
const nightmare = require('nightmare');
const n = nightmare({ show: false });
const tinderPromise = require('./promiseTinder.js');


const FACEBOOK_AUTH_URL = 'https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token';
const FACEBOOK_URL = 'https://facebook.com';

router.post('/auth/facebook', (req, res) => {
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
      console.log('AllDone!');
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log('Error');
      res.status(400).json(err);
    });
  });
});

router.post('/tinder/like', (req, res) => {
  const userToken = req.body.userToken;
  const userId = req.body.userId;
  const likeUser = req.body.likeUserId;

  client.authorize(userToken, userId, () => {

  });
});


module.exports = router;

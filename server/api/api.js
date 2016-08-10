const router = require('express').Router(); // eslint-disable-line new-cap
const tinder = require('tinder');
const client = new tinder.TinderClient();
const tinderPromise = require('./promiseTinder.js');

router.post('/auth/facebook', (req, res) => {
  const id = req.body.login;
  const token = req.body.password;
  client.authorize(token, id, () => {
    const authToken = client.getAuthToken();
    res.status(200).json(authToken);
  });
});

router.post('/tinder/data', (req, res) => {
  const xAuth = req.body.token;
  const client = new tinder.TinderClient();
  client.setAuthToken(xAuth);
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

router.post('/tinder/like', (req, res) => {
  const likeUser = req.body.likeUserId;
  const xAuth = req.body.token;
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
  const xAuth = req.body.token;
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
  const xAuth = req.body.token;
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
  const xAuth = req.body.token;
  const client = new tinder.TinderClient();

  client.setAuthToken(xAuth);
  tinderPromise.getRecommendations(client)
  .then((response) => res.status(200).json(response))
  .catch((error) => res.status(400).json(error));
});


module.exports = router;

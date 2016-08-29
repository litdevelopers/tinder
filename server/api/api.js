const router = require('express').Router(); // eslint-disable-line new-cap
const tinder = require('tinder');
const tinderPromise = require('./promiseTinder.js');

router.post('/auth/facebook/:token', (req, res) => {
  const token = req.params.token;
  const client = new tinder.TinderClient();
  client.authorize(token, 0, () => {
    res.status(200).json({ authToken: client.getAuthToken(), fbToken: token });
  });
});

router.post('/tinder/user', (req, res) => {
  const { authToken } = req.body;
  const client = new tinder.TinderClient();
  client.setAuthToken(authToken);
  tinderPromise.getMeta(client)
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.post('/tinder/history', (req, res) => {
  const { authToken } = req.body;
  const client = new tinder.TinderClient();
  client.setAuthToken(authToken);
  tinderPromise.getHistory(client)
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});


router.post('/tinder/historynew', (req, res) => {
  const { authToken } = req.body;
  const client = new tinder.TinderClient();
  client.setAuthToken(authToken);
  tinderPromise.getHistory(client)
  .then((data) => {
    const returnedArray = data.matches;
    res.status(200).json({
      blocks: data.blocks,
      squads: data.squads,
      deleted_lists: data.deleted_lists,
      lists: data.lists,
      matches: returnedArray,
      final: true,
    });
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.post('/tinder/like', (req, res) => {
  const likeUser = req.body.userID;
  const xAuth = req.body.userToken;
  const content_hash = req.body.hash; // eslint-disable-line
  const client = new tinder.TinderClient();

  client.setAuthToken(xAuth);
  tinderPromise.likePerson(client, likeUser, content_hash)
  .then((response) => {
    res.status(200).json(response);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.post('/tinder/pass', (req, res) => {
  const passUser = req.body.userID;
  const xAuth = req.body.userToken;
  const content_hash = req.body.hash; // eslint-disable-line
  const client = new tinder.TinderClient();

  client.setAuthToken(xAuth);
  tinderPromise.passPerson(client, passUser, content_hash)
  .then((response) => {
    res.status(200).json(response);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.post('/tinder/superlike', (req, res) => {
  const likeUser = req.body.userID;
  const xAuth = req.body.userToken;
  const content_hash = req.body.hash; // eslint-disable-line
  const client = new tinder.TinderClient();

  client.setAuthToken(xAuth);
  tinderPromise.superLikePerson(client, likeUser, content_hash)
  .then((response) => {
    res.status(200).json(response);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.post('/tinder/recommendations', (req, res) => {
  const xAuth = req.body.authToken;
  const client = new tinder.TinderClient();

  client.setAuthToken(xAuth);
  tinderPromise.getRecommendations(client)
  .then((response) => res.status(200).json(response))
  .catch((error) => res.status(400).json(error));
});

router.post('/tinder/updatesnew', (req, res) => {
  const { authToken, lastActivityDate } = req.body;
  const client = new tinder.TinderClient();

  client.setAuthToken(authToken);
  tinderPromise.getUserUpdatesNew(client, lastActivityDate)
  .then((response) => res.status(200).json(response))
  .catch((error) => {
    res.status(400).json(error);
  });
});

router.post('/tinder/checkAuth', (req, res) => {
  const xAuth = req.body.authToken;
  const client = new tinder.TinderClient();

  client.setAuthToken(xAuth);
  tinderPromise.getUserFromId(client, 1)
  .then((response) => res.status(200).json(response))
  .catch((error) => res.status(400).json(error));
});

router.post('/tinder/update/bio', (req, res) => {
  const client = new tinder.TinderClient();
  const { authToken, bio } = req.body;

  client.setAuthToken(authToken);
  tinderPromise.setBio(client, bio)
  .then(() => res.status(200).end())
  .catch((error) => res.status(400).json(error));
});

router.post('/tinder/update/photoOrder', (req, res) => {
  const client = new tinder.TinderClient();
  const { order, authToken } = req.body;

  client.setAuthToken(authToken);
  tinderPromise.setPhotoOrder(order, client)
  .then(() => res.status(200).end())
  .catch((error) => res.status(400).json(error));
});

router.post('/tinder/update/location', (req, res) => {
  const client = new tinder.TinderClient();
  const { location, authToken } = req.body;

  client.setAuthToken(authToken);
  tinderPromise.setLocation(location, client)
  .then(() => res.status(200).end())
  .catch((error) => res.status(400).json(error));
});

router.post('/tinder/message/:id', (req, res) => {
  const client = new tinder.TinderClient();
  const { userToken, message } = req.body;
  const id = req.params.id;
  client.setAuthToken(userToken);
  tinderPromise.sendMessage(client, id, message)
  .then((result) => res.status(200).json(result))
  .catch((error) => res.status(400).json(error));
});


router.post('/tinder/update/profile', (req, res) => {
  const client = new tinder.TinderClient();
  const { profile, authToken } = req.body;

  client.setAuthToken(authToken);
  tinderPromise.setProfile(profile, client)
  .then(() => res.status(200).end())
  .catch((error) => res.status(400).json(error));
});

router.post('/tinder/update/profile/gender', (req, res) => {
  const client = new tinder.TinderClient();
  const { gender, authToken } = req.body;

  client.setAuthToken(authToken);
  tinderPromise.setProfile(gender, client)
  .then(() => res.status(200).end())
  .catch((error) => res.status(400).json(error));
});

router.post('/tinder/getuser', (req, res) => {
  const client = new tinder.TinderClient();
  const { userId, userToken } = req.body;

  client.setAuthToken(userToken);
  tinderPromise.getUserFromId(client, userId)
  .then((data) => res.status(200).json(data))
  .catch((error) => res.status(400).json(error));
});

module.exports = router;

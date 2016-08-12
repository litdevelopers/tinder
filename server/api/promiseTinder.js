const MAX_REC_SIZE = 40;

function getHistory(client) {
  return new Promise((resolve, reject) => {
    client.getHistory((error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

function getDefaults(client) {
  return new Promise((resolve) => {
    const defaultData = client.getDefaults();
    resolve(defaultData);
  });
}

function getRecommendations(client) {
  return new Promise((resolve, reject) => {
    client.getRecommendations(MAX_REC_SIZE, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data.results.filter((each) => !each.is_brand));
      }
    });
  });
}

function getAuthToken(client) {
  return new Promise((resolve) => resolve(client.getAuthToken()));
}

function likePerson(client, id) {
  return new Promise((resolve, reject) => {
    client.like(id, (error, response) => {
      if (error || !response.likes_remaining) {
        console.log(response);
        reject(error || { message: 'LIMIT_EXCEEDED', timeUntil: response.rate_limited_until });
      } else {
        resolve(response);
      }
    });
  });
}

function passPerson(client, id) {
  return new Promise((resolve, reject) => {
    client.pass(id, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function superLikePerson(client, id) {
  return new Promise((resolve, reject) => {
    client.superLike(id, (error, response) => {
      if (error || response.limit_exceeded) {
        reject(error || 'LIMIT_EXCEEDED');
      } else {
        resolve(response);
      }
    });
  });
}



module.exports = {
  getHistory,
  getDefaults,
  getRecommendations,
  getAuthToken,
  likePerson,
  passPerson,
  superLikePerson,
};

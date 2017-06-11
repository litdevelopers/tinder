const MAX_REC_SIZE = 15;

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

function getHistoryNew(client, ISOString) {
  return new Promise((resolve, reject) => {
    client.getHistoryWithDate(ISOString, (error, data) => {
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
      } else if (!data.results) {
        resolve('NO RECOMENDATIONS FOUND');
      } else {
        resolve(data.results.filter((each) => !each.is_brand));
      }
    });
  });
}

function getUserFromId(client, user) {
  return new Promise((resolve, reject) => {
    client.getUser(user, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function getMeta(client) {
  return new Promise((resolve, reject) => {
    client.getAccount((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function getUserUpdates(client) {
  return new Promise((resolve, reject) => {
    client.getUpdates((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function getUserUpdatesNew(client, lastActivityDate = 10) {
  return new Promise((resolve, reject) => {
    client.fetchUpdates(lastActivityDate, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function getAuthToken(client) {
  return new Promise((resolve) => resolve(client.getAuthToken()));
}

function likePerson(client, id, hash) {
  return new Promise((resolve, reject) => {
    client.like(id, hash, (error, response) => {
      if (error || !response.likes_remaining) {
        reject(error || { message: 'LIMIT_EXCEEDED', timeUntil: response.rate_limited_until });
      } else {
        resolve(response);
      }
    });
  });
}

function passPerson(client, id, hash) {
  return new Promise((resolve, reject) => {
    client.pass(id, hash, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function superLikePerson(client, id, hash) {
  return new Promise((resolve, reject) => {
    client.superLike(id, hash, (error, response) => {
      if (error || response.limit_exceeded) {
        reject(error || 'LIMIT_EXCEEDED');
      } else {
        resolve(response);
      }
    });
  });
}

function setBio(client, newBio) {
  return new Promise((resolve, reject) => {
    client.updateBio(newBio, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function sendMessage(client, id, message) {
  return new Promise((resolve, reject) => {
    client.sendMessage(id, message, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function unmatch(client, id) {
  return new Promise((resolve, reject) => {
    client.unmatch(id, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function setPhotoOrder(newOrder, client) {
  return new Promise((resolve, reject) => {
    client.updatePhotoOrder(newOrder, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function setProfile(newProfileObject, client) {
  return new Promise((resolve, reject) => {
    client.updatePreferences(newProfileObject, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function setLocation({ lat, lng }, client) {
  return new Promise((resolve, reject) => {
    client.updatePosition(lng, lat, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

function setGender(newValue, client) {
  return new Promise((resolve, reject) => {
    client.setGender(newValue, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}


module.exports = {
  getHistory,
  getHistoryNew,
  getDefaults,
  getRecommendations,
  getAuthToken,
  getUserUpdates,
  getUserUpdatesNew,
  likePerson,
  passPerson,
  superLikePerson,
  getUserFromId,
  getMeta,
  setBio,
  sendMessage,
  unmatch,
  setPhotoOrder,
  setLocation,
  setProfile,
  setGender,
};

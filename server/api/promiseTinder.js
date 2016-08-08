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
  });
}

module.exports = {
  getHistory,
  getDefaults,
  getRecommendations,
  getAuthToken,
};

import axios from 'axios';

export function postRequest(url, body) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: 'POST',
      data: body,
      timeout: 10000,
    })
    .then((result) => {
      resolve(result);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

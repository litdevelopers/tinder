import axios from 'axios';

export function postRequest(url, body) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: 'POST',
      data: body,
      timeout: 20000,
    })
    .then((result) => {
      resolve(result);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

import axios from 'axios';

export function postRequest(url, body){
    return new Promise ((resolve, reject) => {
        axios.post(url, body)
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            reject(error);
        })
    })
}
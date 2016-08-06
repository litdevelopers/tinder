import {
    CHANGE_PASSWORD,
    CHANGE_LOGIN,
    LOGIN_FACEBOOK,
    LOGIN_FACEBOOK_SUCCESS,
    LOGIN_FACEBOOK_ERROR,
} from './constants';


export function changeLogin(login){
    return {
        type: CHANGE_LOGIN,
        payload: login,
    };
}

export function changePassword(password){
    return {
        type: CHANGE_PASSWORD,
        payload: password,
    }
}

export function loginFacebook(){
    return {
        type: LOGIN_FACEBOOK,
    };
}

export function loginFacebookError(error){
    return {
        type: LOGIN_FACEBOOK_ERROR,
        payload: error
    };
}

export function loginFacebookSuccess({ id, token }){
    return {
        type: LOGIN_FACEBOOK_SUCCESS,
        payload: {
            id,
            token,
        }
    };
}
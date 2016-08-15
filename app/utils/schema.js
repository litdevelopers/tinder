import { Schema, arrayOf } from 'normalizr';

export const history = new Schema('history');
export const match = new Schema('matches');
const message = new Schema('messages');
const person = new Schema('people');


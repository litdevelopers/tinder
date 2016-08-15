import { Schema, arrayOf } from 'normalizr';

export const match = new Schema('matches');
const message = new Schema('messages');
const person = new Schema('persons');

match.define({
  messages: arrayOf(message),
  person,
});

import { Schema, arrayOf } from 'normalizr';

export const match = new Schema('matches', { idAttribute: '_id' });
export const message = new Schema('messages', { idAttribute: '_id' });
export const person = new Schema('people', { idAttribute: '_id' });

match.define({
  messages: arrayOf(message),
  person,
});
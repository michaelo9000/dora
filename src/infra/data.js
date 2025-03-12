import Dexie from 'dexie';

export const db = new Dexie('doraDb');

db.version(1).stores({
  words: '++id, value'
});

export const WordTypes = {
    Verb: 0,
    Noun: 1,
    Adjective: 2
};

export function getWordTypeName(value) {
  let keys = Object.keys(WordTypes);
  // Multiply by 1 to convert the stringified value to a number lol
  let key = keys.find(i => WordTypes[i] === value * 1);
  return key;
}
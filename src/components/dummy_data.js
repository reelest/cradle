import { useMemo, useRef, useState } from "react";

const firstNames =
  "John, Mary, Charles, Pickle, James, Stuart, Reina, Toby, Dick, Samuel, James, Brandon, Ron, Vera, Stanley, Helen".split(
    ", "
  );
const lastNames =
  "Holmes, Fisher, Bush, Clinton, Johnson, Farmer, Page, Gates, Musk, McDonalds, Paige, Tate".split(
    ", "
  );
let _seed = 100;
// Pseudo random number generator(Mulberry-32).
const next = () => {
  var t = (_seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const gen = (num) => Math.floor(next() * Math.max(0, num));
const pick = (arr) => {
  return arr[gen(arr.length)];
};
const FirstName = () => pick(firstNames);
const LastName = () => pick(lastNames);
const pastDate = (range = 1000 * 60 * 60 * 24 * 365) =>
  new Date(Date.now() - gen(range));
const futureDate = (range = 1000 * 60 * 60 * 24 * 365) =>
  new Date(Date.now() + gen(range));
const date = (...args) => pick([pastDate(...args), futureDate(...args)]);
const email = (firstName, lastName) =>
  `${firstName}${pick([
    "",
    `.${lastName.slice(0, gen(lastName.length - 5) + 6)}`,
  ])}${pick(["", gen(100)])})@${pick(["gmail", "outlook"])}.com`;

const dbs = {};
const getDB = (name) => {
  if (dbs[name]) return dbs[name];
  else
    return (dbs[name] = {
      elements: [],
      counters: {},
    });
};
const fillProperty = (type, firstName, lastName, obj) => {
  switch (type) {
    case "name":
      return `${firstName} ${lastName}`;
    case "firstName":
      return firstName;
    case "lastName":
      return lastName;
    case "email":
      return email();
    case "date":
      return date();
    case "pastDate":
      return pastDate();
    case "futureDate":
      return futureDate();
    default:
      const p = /^(\w+)\((.*)\)$/.exec(type);
      if (!p) return type;
      let [, fn, arg] = p;
      arg = fillProperty(arg, firstName, lastName, obj);
      switch (fn) {
        case "pastDate":
          return pastDate(Number(arg));
        case "futureDate":
          return futureDate(Number(arg));
        case "range":
          const [min, max] = arg.split(",").map(Number);
          return min + gen(max - min);
        case "insert_id":
          let db = getDB(arg);
          if (db.elements.includes(obj)) return db.elements.indexOf(obj);
          return db.elements.push(obj);

        case "ref":
          const [db_name, ctr = "default"] = arg.split(",");
          db = getDB(db_name);
          if (db.counters[ctr] == undefined) {
            db.counters[ctr] = 0;
          }
          return db.elements[db.counters[ctr]++];
        default:
          return type;
      }
  }
};
const dummyData = (API) => {
  let firstName = FirstName();
  let lastName = LastName();
  const res = {};
  for (let property in API) {
    if (typeof API[property] == "string") {
      res[property] = fillProperty(API[property], firstName, lastName, API);
    } else if (Array.isArray(API[property])) {
      const [type, minLength = 10, maxLength = 10] = API[property];
      const res_arr = [];
      for (let j = 0, N = minLength + gen(maxLength - minLength); j < N; j++) {
        res_arr.push(dummyData({ data: type }).data);
      }
      res[property] = res_arr.filter(Boolean);
    } else if (API[property] && typeof (API[property] == "object")) {
      res[property] = dummyData(API[property]);
    }
  }
  return res;
};

export default function useDummyData(api) {
  return useMemo(() => {
    _seed = 100; //Tried everything to preserve this across rehydration to no avail
    return dummyData(api);
  }, [api]);
}
global.dummyData = useDummyData;

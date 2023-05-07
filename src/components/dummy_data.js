import { useMemo, useRef, useState } from "react";
import { faker } from "@faker-js/faker/locale/en_NG";

const FirstName = () => faker.name.firstName();
const LastName = () => faker.name.lastName();
const pastDate = (days = 365) => faker.date.recent(days);
const futureDate = (days = 365) => faker.date.soon(days);
const date = (...args) =>
  faker.helpers.arrayElement([pastDate(...args), futureDate(...args)]);
const email = (firstName, lastName) =>
  faker.internet.email(firstName, lastName);

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
          return faker.datatype.number({ min, max });
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
      const N = faker.datatype.number({ min: minLength, max: maxLength });
      for (let j = 0; j < N; j++) {
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
    //Tried everything to preserve this across rehydration to no avail so we'll just use a fixed value
    faker.seed(100);
    return dummyData(api);
  }, [api]);
}
global.dummyData = useDummyData;

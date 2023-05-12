import { useState, useEffect, useRef } from "react";

/**
 * Allows multiple components to share a data source. The data source is setup when the first component is created and closed when the last component is destroyed.
 * @param {function} onSubscribe - called when the first subscriber is registered
 * @returns [useSubscription, subscribe, dispatch]
 */
export default function createSubscription(onSubscribe) {
  const subscribers = [];
  let onUnsubscribe;
  let currentData;
  const subscribe = function (onNewData) {
    subscribers.push(onNewData);
    if (subscribers.length === 1) {
      //First subscriber might have different hooks
      onUnsubscribe = onSubscribe(dispatch);
    }
    if (currentData !== undefined) onNewData(currentData);
    return unsubscribe;
  };
  const unsubscribe = function (setData) {
    const index = subscribers.indexOf(setData);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
    if (subscribers.length === 0) {
      if (onUnsubscribe) onUnsubscribe();
    }
  };
  const dispatch = function (data) {
    currentData = data;
    /**Update parents first in case of child assumptions */
    subscribers.forEach((e) => e(data));
  };
  return [
    function useSubscription() {
      const [data, setData] = useState(currentData);
      const unsubscribe = useRef(false);
      if (!unsubscribe.current)
        unsubscribe.current = subscribe(setData) || true;
      useEffect(
        () => () => {
          try {
            if (typeof unsubscribe.current == "function") unsubscribe.current();
          } finally {
            unsubscribe.current = false;
          }
        },
        []
      );
      /** Changing data without update hooks causes rendering artifacts */
      return data;
    },
    subscribe,
    dispatch,
  ];
}

import { useMemo } from "react";
import { useState, useEffect, useRef } from "react";
export default function usePromise(createPromise, deps) {
  const [, setData] = useState({});
  const ref = useRef({});
  useMemo(
    function () {
      ref.current = undefined;
    },
    [...deps]
  );
  useEffect(
    function () {
      let stale = false;
      const promise = createPromise();
      promise.then(function (data) {
        if (!stale) {
          ref.current = data;
          setData(data);
        }
      });
      return function () {
        stale = true;
      };
    },
    [...deps]
  );
  return ref.current;
}

import { usePreviousDistinct } from "react-use";
import deepEqual from "deep-equal";
import { useRef } from "react";
export default function useDeepMemo(fn, deps) {
  const store = useRef({ deps: [], result: undefined });
  if (deepEqual(store.current.deps, deps, { strict: true })) {
    return store.current.result;
  }
  store.current.deps = deps;
  return (store.current.result = fn());
}

export function useJSONMemo(fn, deps) {
  const store = useRef({ deps: [], result: undefined });
  if (JSON.stringify(store.current.deps) === JSON.stringify(deps)) {
    return store.current.result;
  }
  store.current.deps = deps;
  return (store.current.result = fn());
}

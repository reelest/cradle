import useDummyData, { pick } from "@/utils/dummy_data";
import usePromise from "@/utils/usePromise";
import { useRef } from "react";

//Every API either returns an object or undefined ie loading
const useAsyncDummyData = (API) => {
  API = useRef(API).current;
  const data = useDummyData(API);
  return usePromise(() => Promise.resolve(data), [data]);
};
export const useAnnouncementsAPI = () =>
  useAsyncDummyData({ announcements: ["admission", 1, 1] });

import { useAsyncDummyData } from "@/utils/dummy_data";
import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useAsync } from "react-use";

export const useAnnouncementsAPI = () =>
  useAsyncDummyData({ announcements: ["admission", 1, 1] });

export const forgotPasswordAPIUrl = "/api/resetpassword";
export const doLogin = () => {
  localStorage.setItem("logged-in");
};
export const useLoginError = () => {
  const query = useRouter().query;
  return useMemo(
    function () {
      if (query.hasOwnProperty("error-user")) return "Email is not registered";
      if (query.hasOwnProperty("error-password")) return "Wrong password";
    },
    [query]
  );
};

export const useLoggedIn = () => {
  return (
    useAsync(async () => (await fetch("/api/checklogin")).json()).value == true
  );
};

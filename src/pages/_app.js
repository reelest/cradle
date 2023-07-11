import "@/styles/globals.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";
import { SWRConfig } from "swr";
import { fetcher } from "@/logic/api";

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        errorRetryCount: 3,
        //Leave everything on default
        // refreshInterval: 0,
        // shouldRetryOnError: true,
        // errorRetryInterval: 5000,
        // revalidateOnMount: true,
        // revalidateOnFocus: true,
        // revalidateIfStale: true,
        // revalidateOnReconnect: true,
        // refreshWhenOffline: false,
        // refreshWhenHidden: false,
        dedupingInterval:
          process && process.env.NODE_ENV === "development" ? 1000 : 10000, // this wrongly named property
        fetcher,
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

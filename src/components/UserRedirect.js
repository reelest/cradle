import { useUser } from "@/logic/api";
import { useRouter } from "next/router";
import FullscreenLoader from "./FullscreenLoader";

const UNAUTHENTICATED_URLS = ["/login", "/"];

const DASHBOARD_URL = {
  admin: "/admin",
  student: "/student",
  parent: "/parent",
  teacher: "/teacher",
};
export default function UserRedirect({ noAuth, auth, children }) {
  const user = useUser();
  const router = useRouter();
  if (user === undefined) {
    return <FullscreenLoader />;
  } else if (user === null) {
    if (auth) {
      router.replace("/login");
      return;
    }
  } else if (noAuth) {
    router.replace(DASHBOARD_URL[user.role]);
    return;
  }
  return children;
}

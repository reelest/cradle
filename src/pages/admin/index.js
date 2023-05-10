import { useLoggedIn } from "@/logic/api";
export default function Admin() {
  const loggedIn = useLoggedIn();
  return String(loggedIn);
}

import FullscreenLoader from "@/components/FullscreenLoader";
import UserRedirect from "@/components/UserRedirect";

export default function HomePage() {
  return <UserRedirect auth noAuth />;
}

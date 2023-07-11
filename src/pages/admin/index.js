import UserRedirect from "@/components/UserRedirect";
import accountBalanceWallet from "./assets/account_balance_wallet.svg";
import group from "./assets/group.svg";
import hub from "./assets/hub.svg";
import school from "./assets/school.svg";
import spaceDashboard from "./assets/space_dashboard.svg";
import Head from "next/head";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/router";
import MainView from "./dashboard";
import UsersView from "./users";
import useScrollAnchor from "@/utils/useScrollAnchor";
import AcademicsView from "./academic";
import FinancialsView from "./financial";
import CommunicationsView from "./communications";

const ADMIN_TABS = [
  {
    name: "Dashboard",
    icon: spaceDashboard,
    component: MainView,
  },
  {
    name: "Users",
    icon: group,
    component: UsersView,
  },
  {
    name: "Academic",
    icon: school,
    component: AcademicsView,
  },
  {
    name: "Financial",
    icon: accountBalanceWallet,
    component: FinancialsView,
  },
  {
    name: "Communication",
    icon: hub,
    component: CommunicationsView,
  },
];

export default function Admin() {
  const tab = useRouter().query.tab;
  const ActiveView =
    ADMIN_TABS.filter(
      ({ name, id = encodeURIComponent(name.toLowerCase()) }) => id === tab
    )[0]?.component || MainView;

  const scrollAnchor = useScrollAnchor(ActiveView);
  return (
    <>
      <Head>
        <title>Cradle - Administator Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Generated by create next app" />
      </Head>
      <DashboardLayout tabs={ADMIN_TABS}>
        <UserRedirect redirectOnNoUser>
          {scrollAnchor}
          <ActiveView />
        </UserRedirect>
      </DashboardLayout>
    </>
  );
}

import { useOutletContext } from "react-router";
import type { AppLayoutCtx } from "../layout/AppLayout";
import { Dashboard } from "../app/components/dashboard/Dashboard";

export default function DashboardPage() {
  const { openCreateLink } = useOutletContext<AppLayoutCtx>();
  return <Dashboard onCreateLink={openCreateLink} />;
}

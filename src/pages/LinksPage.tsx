import { useOutletContext } from "react-router";

import type { AppLayoutCtx } from "../layout/AppLayout";
import { LinksList } from "../app/components/links/LinksList";

export default function LinksPage() {
  const { openCreateLink, openEditLink, openLinkAnalytics, openLinkQr, isAdmin, linksRefreshKey } =
    useOutletContext<AppLayoutCtx>();

  return (
    <LinksList
      onCreateLink={openCreateLink}
      onEditLink={openEditLink}
      onOpenAnalytics={openLinkAnalytics}
      onOpenQr={openLinkQr}
      canManage={isAdmin}
      refreshKey={linksRefreshKey}
    />
  );
}

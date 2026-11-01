import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/shell";
import { signOutInvestor } from "@/lib/actions";
import { loadPortal } from "@/lib/session";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  const collapsed = (await cookies()).get("partner-nav")?.value === "collapsed";
  return (
    <PortalShell
      investor={{
        name: portal.investor.name,
        email: portal.investor.email,
        code: portal.investor.code,
        tier: portal.investor.tier,
      }}
      startCollapsed={collapsed}
      signOut={signOutInvestor}
    >
      {children}
    </PortalShell>
  );
}

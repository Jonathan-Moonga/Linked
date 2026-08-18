import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Screen, Logo } from "@/components/ui";
import { NotificationsClient } from "./NotificationsClient";
import { getNotifications } from "@/lib/notifications-data";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const notifications = getNotifications();

  return (
    <Screen>
      <Logo />
      <div className="pt-[70px] px-[24px] pb-[180px]">
        <NotificationsClient initial={notifications} />
      </div>
    </Screen>
  );
}

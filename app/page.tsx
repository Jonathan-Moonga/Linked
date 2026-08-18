import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Screen, Logo } from "@/components/ui";
import { getNotifications } from "@/lib/notifications-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const notifications = getNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  async function signOutAction() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <Screen>
      <Logo />
      <Link
        href="/notifications"
        className="absolute right-6 top-5 flex items-center justify-center w-9 h-9 rounded-full bg-field hover:opacity-80 transition-opacity"
        aria-label="Notifications"
      >
        <span className="text-sm">{"\ud83d\udd14"}</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Link>
      <div className="pt-[140px] px-[29px] flex flex-col gap-4">
        <h1 className="text-lg font-normal">You&rsquo;re signed in.</h1>
        <p className="text-xs text-black/70">{user.email}</p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="h-[35px] w-[150px] rounded-pill bg-field text-xs font-bold text-black hover:opacity-80 transition-opacity"
          >
            Sign out
          </button>
        </form>
      </div>
    </Screen>
  );
}

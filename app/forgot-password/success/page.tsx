import Link from "next/link";
import { AuthShell, StatusIcon } from "@/components/ui";

export default function ResetSuccessPage() {
  return (
    <AuthShell compact>
      <div className="flex flex-col items-center gap-6 text-center">
        <StatusIcon />
        <h1 className="text-4xl font-extrabold tracking-[-0.04em]">Password updated</h1>
        <p className="max-w-md text-base leading-7 text-slate-600">
          Your password has been updated. You can now sign in with your new password.
        </p>
        <Link
          href="/login"
          className="flex min-h-12 w-full max-w-sm items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white hover:bg-sky-900"
        >
          Back to Sign in
        </Link>
      </div>
    </AuthShell>
  );
}

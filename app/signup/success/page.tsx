import Link from "next/link";
import { AuthShell, StatusIcon } from "@/components/ui";

export default function SignupSuccessPage({ searchParams }: { searchParams: { confirmation?: string } }) {
  const needsConfirmation = searchParams.confirmation === "email";

  return (
    <AuthShell compact>
      <div className="flex flex-col items-center gap-6 text-center">
        <StatusIcon kind={needsConfirmation ? "email" : "success"} />
        <h1 className="text-4xl font-extrabold tracking-[-0.04em]">{needsConfirmation ? "Check your email" : "Account created"}</h1>
        <p className="max-w-md text-base leading-7 text-slate-600">
          {needsConfirmation
            ? "We sent you a confirmation link. Open it before signing in to activate your account."
            : "Welcome to Linked. Your account is ready — let’s find your first project."}
        </p>
        <Link
          href={needsConfirmation ? "/login" : "/"}
          className="flex min-h-12 w-full max-w-sm items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white hover:bg-sky-900"
        >
          {needsConfirmation ? "I’ve confirmed my email" : "Continue to Linked"}
        </Link>
      </div>
    </AuthShell>
  );
}

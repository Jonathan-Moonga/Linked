import { AuthShell, BackLink, Headline } from "@/components/ui";
import { VerifyForm } from "./VerifyForm";

export default function VerifyPage({ searchParams }: { searchParams: { email?: string } }) {
  const email = searchParams.email ?? "";

  return (
    <AuthShell compact>
      <BackLink href="/forgot-password" />
      <Headline eyebrow="Verify your identity" description={<>If an account exists, enter the six-digit code sent to <strong className="font-semibold text-slate-900">{maskEmail(email)}</strong>. The code expires shortly.</>}>Check your email</Headline>
      <VerifyForm email={email} />
    </AuthShell>
  );
}

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "your email";
  const visible = user.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(user.length - 1, 3))}@${domain}`;
}

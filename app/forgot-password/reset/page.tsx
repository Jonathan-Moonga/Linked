import { AuthShell, BackLink, Headline } from "@/components/ui";
import { ResetForm } from "./ResetForm";

export default function ResetPage() {
  return (
    <AuthShell compact>
      <BackLink href="/forgot-password" />
      <Headline eyebrow="Secure your account" description="Choose a strong password you haven’t used for Linked before.">Create a new password</Headline>
      <ResetForm />
    </AuthShell>
  );
}

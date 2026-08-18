import { AuthShell, BackLink, Headline } from "@/components/ui";
import { RequestForm } from "./RequestForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell compact>
      <BackLink href="/login" label="Back to Sign in" />
      <Headline eyebrow="Account recovery" description="Enter the email associated with your account. If an account exists, we’ll send a six-digit recovery code.">Forgot your password?</Headline>
      <RequestForm />
    </AuthShell>
  );
}

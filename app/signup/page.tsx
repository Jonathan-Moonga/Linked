import { AuthShell, Headline } from "@/components/ui";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <AuthShell active="signup">
      <Headline eyebrow="Join the community" description="Create your profile and start finding students whose skills complement your ideas.">Create your account</Headline>
      <SignupForm />
    </AuthShell>
  );
}

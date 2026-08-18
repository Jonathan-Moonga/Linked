import { AuthShell, Headline } from "@/components/ui";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <AuthShell active="signin">
      <Headline eyebrow="Welcome back" description="Sign in to continue your research journey and reconnect with your collaborators.">Sign in to Linked</Headline>
      <LoginForm />
    </AuthShell>
  );
}

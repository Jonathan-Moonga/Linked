"use client";

import Link from "next/link";
import { InputHTMLAttributes, ReactNode, useState } from "react";
import { FiAlertCircle, FiArrowLeft, FiArrowRight, FiCheck, FiEye, FiEyeOff, FiMail, FiMessageCircle, FiTrendingUp, FiUsers } from "react-icons/fi";
import { SiGithub, SiGoogle } from "react-icons/si";

export function Screen({ children }: { children: ReactNode }) {
  return <main className="min-h-dvh bg-slate-50 text-slate-950"><div className="mx-auto min-h-dvh w-full max-w-6xl px-5 py-6 sm:px-8">{children}</div></main>;
}

export function Logo({ light = false }: { light?: boolean }) {
  return <Link href="/login" className={`inline-flex items-center text-2xl font-extrabold tracking-[-0.04em] ${light ? "text-white" : "text-slate-950"}`}>Linked<span className="text-sky-600">.</span></Link>;
}

export function AuthShell({
  children,
  active,
  compact = false,
}: {
  children: ReactNode;
  active?: "signin" | "signup";
  compact?: boolean;
}) {
  return (
    <main className="min-h-dvh bg-white text-slate-950 lg:grid lg:grid-cols-[minmax(420px,1fr)_minmax(560px,1fr)]">
      <aside className="auth-brand relative hidden overflow-hidden lg:flex lg:min-h-dvh lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="relative z-10"><Logo /></div>
        <div className="relative z-10 max-w-xl py-14">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-sky-800">Research is better together</p>
          <h2 className="text-[clamp(2.75rem,4vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.05em]">Find collaborators.<br />Share ideas.<br />Advance knowledge.</h2>
          <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">Linked connects curious students, aligns expertise, and helps meaningful research come to life—together.</p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-5">
          <BrandFeature icon={<FiUsers />} title="Discover peers" />
          <BrandFeature icon={<FiMessageCircle />} title="Collaborate easily" />
          <BrandFeature icon={<FiTrendingUp />} title="Make an impact" />
        </div>
      </aside>

      <section className="flex min-h-dvh flex-col bg-white">
        <header className="flex min-h-20 items-center justify-between border-b border-slate-100 px-5 sm:px-8 lg:px-12 xl:px-20">
          <div className="lg:hidden"><Logo /></div>
          <div className="hidden text-sm text-slate-500 lg:block">Where student ideas find their team.</div>
          {active ? <TabSwitch active={active} /> : <Link href="/login" className="text-sm font-semibold text-sky-700 hover:text-sky-900">Back to sign in</Link>}
        </header>
        <div className={`flex flex-1 items-center px-5 py-10 sm:px-8 sm:py-14 lg:px-12 xl:px-20 ${compact ? "justify-center" : ""}`}>
          <div className={`mx-auto w-full ${compact ? "max-w-xl" : "max-w-[560px]"}`}>{children}</div>
        </div>
      </section>
    </main>
  );
}

function BrandFeature({ icon, title }: { icon: ReactNode; title: string }) {
  return <div><span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-xl text-sky-800 shadow-sm">{icon}</span><p className="text-sm font-bold text-slate-800">{title}</p></div>;
}

export function BackLink({ href, label = "Back" }: { href: string; label?: string }) {
  return <Link href={href} className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-sky-800"><FiArrowLeft aria-hidden />{label}</Link>;
}

export function TabSwitch({ active }: { active: "signin" | "signup" }) {
  return (
    <nav aria-label="Authentication" className="flex rounded-full bg-slate-100 p-1">
      <Link href="/login" aria-current={active === "signin" ? "page" : undefined} className={`flex min-h-10 items-center rounded-full px-4 text-sm font-semibold transition ${active === "signin" ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:text-slate-950"}`}>Sign in</Link>
      <Link href="/signup" aria-current={active === "signup" ? "page" : undefined} className={`flex min-h-10 items-center rounded-full px-4 text-sm font-semibold transition ${active === "signup" ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:text-slate-950"}`}>Sign up</Link>
    </nav>
  );
}

export function Headline({ children, eyebrow, description }: { children: ReactNode; eyebrow?: string; description?: ReactNode }) {
  return <div className="mb-8">{eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-700">{eyebrow}</p>}<h1 className="text-4xl font-extrabold leading-tight tracking-[-0.045em] sm:text-5xl">{children}</h1>{description && <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">{description}</p>}</div>;
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: ReactNode; toggleable?: boolean };

export function Field({ label, error, hint, toggleable, type, id, ...props }: FieldProps) {
  const [revealed, setRevealed] = useState(false);
  const inputType = toggleable ? (revealed ? "text" : "password") : type;
  const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const messageId = `${fieldId}-message`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-sm font-semibold text-slate-800">{label}</label>
      <div className="relative">
        <input {...props} id={fieldId} type={inputType} aria-invalid={Boolean(error)} aria-describedby={(error || hint) ? messageId : undefined} className={`min-h-12 w-full rounded-xl border bg-white px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 ${toggleable ? "pr-20" : ""} ${error ? "border-red-500 ring-4 ring-red-100" : "border-slate-300 hover:border-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-100"}`} />
        {toggleable && <button type="button" onClick={() => setRevealed((v) => !v)} aria-label={revealed ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 flex min-h-10 items-center gap-1.5 -translate-y-1/2 rounded-lg px-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950">{revealed ? <FiEyeOff /> : <FiEye />}<span className="hidden sm:inline">{revealed ? "Hide" : "Show"}</span></button>}
      </div>
      {(error || hint) && <div id={messageId} className={`text-sm leading-5 ${error ? "text-red-700" : "text-slate-500"}`}>{error ?? hint}</div>}
    </div>
  );
}

export function PasswordRequirements({ password }: { password: string }) {
  const checks = [{ label: "At least 8 characters", valid: password.length >= 8 }, { label: "One uppercase letter", valid: /[A-Z]/.test(password) }, { label: "One number", valid: /\d/.test(password) }];
  return <div className="grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-3" aria-label="Password requirements">{checks.map((check) => <span key={check.label} className={`flex items-center gap-1.5 text-xs font-medium ${check.valid ? "text-emerald-700" : "text-slate-500"}`}><FiCheck aria-hidden />{check.label}</span>)}</div>;
}

export function CodeInput({ values, onChange }: { values: string[]; onChange: (next: string[]) => void }) {
  function applyCode(raw: string) { const chars = raw.replace(/\D/g, "").slice(0, values.length).split(""); onChange(values.map((_, i) => chars[i] ?? "")); }
  return <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={(e) => { e.preventDefault(); applyCode(e.clipboardData.getData("text")); }}>
    {values.map((value, i) => <input key={i} id={`code-${i}`} value={value} aria-label={`Digit ${i + 1}`} inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"} maxLength={1} onChange={(e) => { const digit = e.target.value.replace(/\D/g, "").slice(-1); const next = [...values]; next[i] = digit; onChange(next); if (digit && i < values.length - 1) document.getElementById(`code-${i + 1}`)?.focus(); }} onKeyDown={(e) => { if (e.key === "Backspace" && !values[i] && i > 0) document.getElementById(`code-${i - 1}`)?.focus(); }} className="aspect-square w-full min-w-0 rounded-xl border border-slate-300 bg-white text-center text-xl font-bold outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100 sm:text-2xl" />)}
  </div>;
}

export function PillButton({ children, loading, variant = "primary", wide = true, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; variant?: "primary" | "secondary"; wide?: boolean }) {
  return <button {...props} disabled={loading || props.disabled} className={`min-h-12 rounded-xl px-5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-50 ${wide ? "w-full" : ""} ${variant === "primary" ? "bg-slate-950 text-white hover:bg-sky-900" : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"}`}><span className="flex items-center justify-center gap-2">{loading ? <Spinner /> : null}{children}{variant === "primary" && !loading ? <FiArrowRight aria-hidden /> : null}</span></button>;
}

export function Spinner() { return <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />; }
export function Divider() { return <div className="flex items-center gap-4" role="separator"><span className="h-px flex-1 bg-slate-200" /><span className="text-sm text-slate-500">or continue with</span><span className="h-px flex-1 bg-slate-200" /></div>; }
export function Terms() { return <p className="text-center text-xs leading-5 text-slate-500">By continuing, you agree to Linked&rsquo;s <Link href="#" className="font-semibold text-sky-700 hover:underline">Terms of Service</Link> and <Link href="#" className="font-semibold text-sky-700 hover:underline">Privacy Policy</Link>.</p>; }

export function OAuthButton({ provider, onClick, loading, disabled }: { provider: "google" | "github"; onClick: () => void; loading?: boolean; disabled?: boolean }) {
  const label = provider === "google" ? "Continue with Google" : "Continue with GitHub";
  return <button type="button" onClick={onClick} disabled={loading || disabled} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-50">{loading ? <Spinner /> : provider === "google" ? <SiGoogle className="text-[#4285F4]" aria-hidden /> : <SiGithub aria-hidden />}{label}</button>;
}

export function ErrorBanner({ message }: { message: string }) { return <div role="alert" aria-live="assertive" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"><FiAlertCircle className="mt-1 shrink-0" aria-hidden /><div><p className="font-bold">We couldn&rsquo;t complete that request</p><p>{message}</p></div></div>; }

export function StatusIcon({ kind = "success" }: { kind?: "success" | "email" }) { return <span className={`flex h-20 w-20 items-center justify-center rounded-3xl text-3xl ${kind === "success" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-800"}`}>{kind === "success" ? <FiCheck aria-hidden /> : <FiMail aria-hidden />}</span>; }
export const SuccessCheck = StatusIcon;

import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { KeyRound, Mail } from "lucide-react";
import { api } from "../services/api";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const requestReset = async (event) => {
    event.preventDefault();
    setLoading(true);
    await api.post("/auth/forgot-password", { email }).finally(() => setLoading(false));
    toast.success("If the email exists, a reset token has been sent.");
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    await api.post("/auth/reset-password", { token, password }).finally(() => setLoading(false));
    toast.success("Password reset successful.");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-4 dark:bg-slate-950">
      <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
        <form onSubmit={requestReset} className="rounded-lg border border-line bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <h1 className="mb-4 text-xl font-bold">Forgot Password</h1>
          <div className="grid gap-4">
            <FormField label="Account email"><input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /></FormField>
            <Button disabled={loading}><Mail size={16} /> Send reset token</Button>
          </div>
        </form>
        <form onSubmit={resetPassword} className="rounded-lg border border-line bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-bold">Reset Password</h2>
          <div className="grid gap-4">
            <FormField label="Reset token"><input value={token} onChange={(e) => setToken(e.target.value)} className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /></FormField>
            <FormField label="New password"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" /></FormField>
            <Button disabled={loading}><KeyRound size={16} /> Reset password</Button>
            <Link className="text-sm font-semibold text-brand" to="/login">Back to login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

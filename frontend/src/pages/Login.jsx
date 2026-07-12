import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Boxes, LogIn, ShieldCheck, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";

const schema = z.object({ email: z.string().email(), password: z.string().min(1), rememberMe: z.boolean().optional() });

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const useLoginPreset = (preset) => {
    setValue("email", preset.email, { shouldValidate: true });
    setValue("password", preset.password, { shouldValidate: true });
  };

  const onSubmit = async (values) => {
    await login(values);
    navigate("/");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-4 dark:bg-slate-950">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-2 text-2xl font-bold"><Boxes className="text-brand" /> AssetFlow</div>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => useLoginPreset({ email: "admin@assetflow.local", password: "ChangeMe@12345" })} className="flex h-12 items-center justify-center gap-2 rounded-md border border-line bg-slate-50 text-sm font-semibold hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800">
              <ShieldCheck size={16} /> Admin
            </button>
            <button type="button" onClick={() => useLoginPreset({ email: "employee@assetflow.local", password: "Employee@12345" })} className="flex h-12 items-center justify-center gap-2 rounded-md border border-line bg-slate-50 text-sm font-semibold hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800">
              <User size={16} /> Employee
            </button>
          </div>
          <FormField label="Email" error={errors.email?.message}><input className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" {...register("email")} /></FormField>
          <FormField label="Password" error={errors.password?.message}><input type="password" className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" {...register("password")} /></FormField>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("rememberMe")} /> Remember me</label>
          <Button disabled={isSubmitting} className="w-full"><LogIn size={16} /> Sign in</Button>
          <Link className="text-sm font-semibold text-brand" to="/forgot-password">Forgot password?</Link>
          <Link className="text-sm font-semibold text-brand" to="/signup">Create employee account</Link>
        </div>
      </form>
    </div>
  );
}

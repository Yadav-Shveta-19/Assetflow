import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, User, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/),
  role: z.enum(["Employee", "Admin"])
});

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "Employee" }
  });
  const selectedRole = watch("role");

  const onSubmit = async (values) => {
    await signup(values);
    navigate("/login");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-4 dark:bg-slate-950">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <h1 className="mb-6 text-2xl font-bold">Create account</h1>
        <div className="grid gap-4">
          <input type="hidden" {...register("role")} />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setValue("role", "Employee", { shouldValidate: true })}
              className={`flex h-12 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition ${selectedRole === "Employee" ? "border-brand bg-teal-50 text-brand dark:bg-slate-800" : "border-line bg-slate-50 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800"}`}
            >
              <User size={16} /> Employee
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "Admin", { shouldValidate: true })}
              className={`flex h-12 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition ${selectedRole === "Admin" ? "border-brand bg-teal-50 text-brand dark:bg-slate-800" : "border-line bg-slate-50 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800"}`}
            >
              <ShieldCheck size={16} /> Admin
            </button>
          </div>
          <FormField label="Full name" error={errors.name?.message}><input className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" {...register("name")} /></FormField>
          <FormField label="Email" error={errors.email?.message}><input className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" {...register("email")} /></FormField>
          <FormField label="Password" error={errors.password && "Use 8+ chars with uppercase, lowercase, number, symbol"}><input type="password" className="rounded-md border border-line px-3 py-2 dark:border-slate-700 dark:bg-slate-950" {...register("password")} /></FormField>
          <Button disabled={isSubmitting} className="w-full"><UserPlus size={16} /> Create account</Button>
          <Link className="text-sm font-semibold text-brand" to="/login">Back to login</Link>
        </div>
      </form>
    </div>
  );
}

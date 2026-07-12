export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const styles = {
    primary: "bg-brand text-white hover:bg-teal-800",
    secondary: "bg-white text-ink border border-line hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:border-slate-700",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };
  return (
    <button className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:opacity-50 ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

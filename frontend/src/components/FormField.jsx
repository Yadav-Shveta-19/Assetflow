export const FormField = ({ label, error, children }) => (
  <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
    <span>{label}</span>
    {children}
    {error && <span className="text-xs text-red-600">{error}</span>}
  </label>
);

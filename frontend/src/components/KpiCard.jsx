import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";

export const KpiCard = ({ title, value, icon: Icon, tone = "bg-teal-50 text-teal-800", trend = 0, helper }) => {
  const TrendIcon = trend < 0 ? TrendingDown : TrendingUp;
  const trendTone = trend < 0 ? "text-red-600 bg-red-50 dark:bg-red-950/40" : "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border border-line bg-white p-4 shadow-soft transition hover:border-teal-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-300">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-normal">{value ?? 0}</p>
        </div>
        <span className={`rounded-md p-2.5 ${tone}`}>{Icon && <Icon size={19} />}</span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs">
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold ${trendTone}`}>
          <TrendIcon size={13} /> {Math.abs(trend)}%
        </span>
        <span className="truncate text-slate-500 dark:text-slate-400">{helper || "vs last period"}</span>
      </div>
    </motion.div>
  );
};

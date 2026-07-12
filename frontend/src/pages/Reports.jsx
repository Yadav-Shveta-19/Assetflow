import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { api } from "../services/api";
import { Button } from "../components/Button";

export default function Reports() {
  const { data } = useQuery({ queryKey: ["reports"], queryFn: async () => (await api.get("/reports/summary")).data.data });
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold">Reports</h1><p className="text-sm text-slate-500">Asset utilization, allocation, maintenance, audit, booking, idle assets, and exports.</p></div>
        <a href={`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/reports/export.csv`}><Button><Download size={16} /> CSV</Button></a>
      </div>
      <pre className="overflow-auto rounded-lg border border-line bg-white p-4 text-sm shadow-soft dark:border-slate-700 dark:bg-slate-900">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

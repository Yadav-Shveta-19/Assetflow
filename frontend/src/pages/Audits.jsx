import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { DataTable } from "../components/DataTable";

export default function Audits() {
  const { data } = useQuery({ queryKey: ["audits"], queryFn: async () => (await api.get("/workflows/audits")).data.data });
  return (
    <div className="grid gap-4">
      <div><h1 className="text-2xl font-bold">Audit Cycles</h1><p className="text-sm text-slate-500">Department and location scoped verification, multiple auditors, discrepancy reports, closing, and locked history.</p></div>
      <DataTable rows={data || []} columns={[
        { key: "name", label: "Audit" },
        { key: "assignedAuditors", label: "Auditors", render: (r) => r.assignedAuditors?.map((u) => u.name).join(", ") || r.assignedAuditor?.name },
        { key: "startDate", label: "Start", render: (r) => new Date(r.startDate).toLocaleDateString() },
        { key: "endDate", label: "End", render: (r) => new Date(r.endDate).toLocaleDateString() },
        { key: "status", label: "Status" }
      ]} />
    </div>
  );
}

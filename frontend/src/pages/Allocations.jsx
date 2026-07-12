import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Repeat2 } from "lucide-react";
import { api } from "../services/api";
import { DataTable } from "../components/DataTable";

export default function Allocations() {
  const allocations = useQuery({ queryKey: ["allocations"], queryFn: async () => (await api.get("/workflows/allocations")).data.data });
  const transfers = useQuery({ queryKey: ["transfers"], queryFn: async () => (await api.get("/workflows/transfers")).data.data });

  return (
    <div className="grid gap-6">
      <div><h1 className="text-2xl font-bold">Asset Allocation & Transfer</h1><p className="text-sm text-slate-500">Allocate to employees or departments, block double allocation, return with condition notes, and move taken assets through transfer requests.</p></div>
      <section>
        <h2 className="mb-2 font-bold">Current Allocations</h2>
        <DataTable rows={allocations.data || []} columns={[
          { key: "asset", label: "Asset", render: (r) => r.asset?.assetTag || r.asset?.name },
          { key: "holder", label: "Holder", render: (r) => r.allocatedToUser?.name || r.allocatedToDepartment?.name },
          { key: "expectedReturnDate", label: "Expected Return", render: (r) => new Date(r.expectedReturnDate).toLocaleDateString() },
          { key: "status", label: "Status", render: (r) => new Date(r.expectedReturnDate) < new Date() && r.status === "Active" ? <span className="inline-flex items-center gap-1 text-red-600"><AlertTriangle size={14} />Overdue</span> : r.status }
        ]} />
      </section>
      <section>
        <h2 className="mb-2 font-bold">Transfer Requests</h2>
        <DataTable rows={transfers.data || []} columns={[
          { key: "asset", label: "Asset" },
          { key: "requestedBy", label: "Requested By" },
          { key: "status", label: "Status", render: (r) => <span className="inline-flex items-center gap-1"><Repeat2 size={14} />{r.status}</span> },
          { key: "reason", label: "Reason" }
        ]} />
      </section>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { DataTable } from "../components/DataTable";

export default function Maintenance() {
  const { data } = useQuery({ queryKey: ["maintenance"], queryFn: async () => (await api.get("/workflows/maintenance")).data.data });
  return (
    <div className="grid gap-4">
      <div><h1 className="text-2xl font-bold">Maintenance</h1><p className="text-sm text-slate-500">Pending requests move to Under Maintenance only after Asset Manager approval, then technician assignment, in-progress work, and resolution.</p></div>
      <DataTable rows={data || []} columns={[
        { key: "asset", label: "Asset", render: (r) => r.asset?.assetTag },
        { key: "priority", label: "Priority" },
        { key: "status", label: "Status" },
        { key: "description", label: "Description" },
        { key: "requestedBy", label: "Requested By", render: (r) => r.requestedBy?.name }
      ]} />
    </div>
  );
}

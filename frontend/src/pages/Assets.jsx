import { useQuery } from "@tanstack/react-query";
import { Plus, QrCode } from "lucide-react";
import { useState } from "react";
import { api } from "../services/api";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";

export default function Assets() {
  const [search, setSearch] = useState("");
  const { data, refetch } = useQuery({ queryKey: ["assets", search], queryFn: async () => (await api.get(`/assets?search=${encodeURIComponent(search)}`)).data.data });
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold">Asset Directory</h1><p className="text-sm text-slate-500">Search by asset tag, serial number, category, department, status, or location.</p></div>
        <Button onClick={() => refetch()}><Plus size={16} /> Register Asset</Button>
      </div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets" className="h-10 rounded-md border border-line px-3 dark:border-slate-700 dark:bg-slate-950" />
      <DataTable rows={data || []} columns={[
        { key: "assetTag", label: "Tag" },
        { key: "name", label: "Name" },
        { key: "serialNumber", label: "Serial" },
        { key: "category", label: "Category", render: (r) => r.category?.name || "-" },
        { key: "department", label: "Department", render: (r) => r.department?.name || "-" },
        { key: "status", label: "Status" },
        { key: "location", label: "Location" },
        { key: "sharedResource", label: "Bookable", render: (r) => r.sharedResource ? "Yes" : "No" },
        { key: "qrCode", label: "QR", render: () => <QrCode size={18} /> }
      ]} />
      <section className="rounded-lg border border-line bg-white p-4 text-sm shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-bold">Per-asset History</h2>
        <p className="mt-1 text-slate-500">Open an asset record through the API at <code>/api/assets/:id</code> and combine it with <code>/api/workflows/allocations</code> and <code>/api/workflows/maintenance</code> to display allocation and maintenance history.</p>
      </section>
    </div>
  );
}

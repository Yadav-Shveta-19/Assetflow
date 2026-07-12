import { useQuery } from "@tanstack/react-query";
import { Bell, History } from "lucide-react";
import { api } from "../services/api";
import { DataTable } from "../components/DataTable";

export default function Activity() {
  const notifications = useQuery({ queryKey: ["notifications"], queryFn: async () => (await api.get("/notifications")).data.data });
  const logs = useQuery({ queryKey: ["activity-logs"], queryFn: async () => (await api.get("/activity-logs")).data.data, retry: false });

  return (
    <div className="grid gap-6">
      <div><h1 className="text-2xl font-bold">Activity Logs & Notifications</h1><p className="text-sm text-slate-500">Role-aware updates for assignments, maintenance, bookings, transfers, overdue returns, and audit discrepancies.</p></div>
      <section>
        <h2 className="mb-2 flex items-center gap-2 font-bold"><Bell size={18} /> Notifications</h2>
        <DataTable rows={notifications.data || []} columns={[
          { key: "title", label: "Title" },
          { key: "type", label: "Type" },
          { key: "message", label: "Message" },
          { key: "readAt", label: "Read", render: (r) => r.readAt ? "Yes" : "No" }
        ]} />
      </section>
      <section>
        <h2 className="mb-2 flex items-center gap-2 font-bold"><History size={18} /> Audit Log</h2>
        <DataTable rows={logs.data || []} columns={[
          { key: "user", label: "User", render: (r) => r.user?.name || "System" },
          { key: "module", label: "Module" },
          { key: "action", label: "Action" },
          { key: "createdAt", label: "When", render: (r) => new Date(r.createdAt).toLocaleString() }
        ]} />
      </section>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { CalendarClock } from "lucide-react";
import { api } from "../services/api";
import { DataTable } from "../components/DataTable";

export default function Bookings() {
  const { data } = useQuery({ queryKey: ["bookings"], queryFn: async () => (await api.get("/workflows/bookings")).data.data });
  return (
    <div className="grid gap-4">
      <div><h1 className="text-2xl font-bold">Resource Booking</h1><p className="text-sm text-slate-500">Calendar-ready shared resource reservations with overlap prevention.</p></div>
      <section className="rounded-lg border border-line bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-bold">Calendar View</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-4">{(data || []).slice(0, 8).map((booking) => <div key={booking._id} className="rounded-md border border-line p-3 text-sm dark:border-slate-700"><b>{booking.resource?.name || booking.resource?.assetTag}</b><p>{new Date(booking.startAt).toLocaleTimeString()} - {new Date(booking.endAt).toLocaleTimeString()}</p><p className="text-slate-500">{booking.status}</p></div>)}</div>
      </section>
      <DataTable rows={data || []} columns={[
        { key: "resource", label: "Resource", render: (r) => r.resource?.name || r.resource?.assetTag },
        { key: "title", label: "Title" },
        { key: "startAt", label: "Start", render: (r) => new Date(r.startAt).toLocaleString() },
        { key: "endAt", label: "End", render: (r) => new Date(r.endAt).toLocaleString() },
        { key: "status", label: "Status", render: (r) => <span className="inline-flex items-center gap-1"><CalendarClock size={14} />{r.status}</span> }
      ]} />
    </div>
  );
}

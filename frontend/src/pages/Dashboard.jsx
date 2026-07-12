import { useQuery } from "@tanstack/react-query";
import { Activity, Boxes, CalendarClock, ClipboardCheck, Clock, Plus, Repeat2, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../services/api";
import { KpiCard } from "../components/KpiCard";

const palette = ["#0f766e", "#2563eb", "#b45309", "#dc2626", "#64748b", "#0891b2"];
const demoKpis = {
  assetsAvailable: 324,
  assetsAllocated: 218,
  maintenanceToday: 7,
  pendingMaintenance: 23,
  activeBookings: 18,
  pendingTransfers: 11,
  upcomingReturns: 15,
  overdueReturns: 5,
  auditProgress: 86
};
const demoDistribution = [
  { name: "Available", value: 324 },
  { name: "Allocated", value: 218 },
  { name: "Maintenance", value: 28 },
  { name: "Retired", value: 14 }
];
const departmentAssets = [
  { name: "IT", assets: 174 },
  { name: "Finance", assets: 82 },
  { name: "HR", assets: 58 },
  { name: "Ops", assets: 132 },
  { name: "Sales", assets: 94 }
];
const monthlyAllocation = [
  { month: "Jan", allocated: 36, returned: 24 },
  { month: "Feb", allocated: 48, returned: 31 },
  { month: "Mar", allocated: 44, returned: 36 },
  { month: "Apr", allocated: 59, returned: 42 },
  { month: "May", allocated: 65, returned: 51 },
  { month: "Jun", allocated: 72, returned: 57 }
];
const maintenanceTrend = [
  { month: "Jan", requests: 12 },
  { month: "Feb", requests: 17 },
  { month: "Mar", requests: 14 },
  { month: "Apr", requests: 21 },
  { month: "May", requests: 18 },
  { month: "Jun", requests: 23 }
];
const bookingAnalytics = [
  { name: "Rooms", bookings: 42 },
  { name: "Laptops", bookings: 65 },
  { name: "Vehicles", bookings: 18 },
  { name: "Projectors", bookings: 31 }
];
const lifecycle = [
  { name: "Procured", value: 120 },
  { name: "In Use", value: 391 },
  { name: "Repair", value: 28 },
  { name: "Retired", value: 14 }
];
const demoActivities = [
  { _id: "demo-1", module: "Assets", action: "registered MacBook Pro fleet", status: "Completed", user: { name: "Ananya Rao" }, createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString() },
  { _id: "demo-2", module: "Allocations", action: "approved laptop assignment", status: "Approved", user: { name: "Rohan Mehta" }, createdAt: new Date(Date.now() - 52 * 60 * 1000).toISOString() },
  { _id: "demo-3", module: "Maintenance", action: "raised repair request", status: "Pending", user: { name: "Priya Shah" }, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { _id: "demo-4", module: "Audit", action: "verified branch inventory", status: "In Review", user: { name: "AssetFlow Bot" }, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() }
];

const chartCard = "rounded-lg border border-line bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900";
const useDemoNumber = (value, fallback) => value || fallback;
const initials = (name = "AF") => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export default function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: async () => (await api.get("/dashboard")).data.data });
  const kpis = data?.kpis || {};
  const chart = data?.charts?.assetDistribution?.length
    ? data.charts.assetDistribution.map((x) => ({ name: x._id, value: x.count }))
    : demoDistribution;
  const activities = data?.recentActivities?.length ? data.recentActivities : demoActivities;
  const cards = [
    ["Assets Available", useDemoNumber(kpis.assetsAvailable, demoKpis.assetsAvailable), Boxes, "bg-teal-50 text-teal-800", 12],
    ["Assets Allocated", useDemoNumber(kpis.assetsAllocated, demoKpis.assetsAllocated), Repeat2, "bg-blue-50 text-blue-700", 8],
    ["Maintenance Today", useDemoNumber(kpis.maintenanceToday, demoKpis.maintenanceToday), Wrench, "bg-amber-50 text-amber-700", -3],
    ["Pending Maintenance", useDemoNumber(kpis.pendingMaintenance, demoKpis.pendingMaintenance), Clock, "bg-orange-50 text-orange-700", 6],
    ["Active Bookings", useDemoNumber(kpis.activeBookings, demoKpis.activeBookings), CalendarClock, "bg-cyan-50 text-cyan-700", 18],
    ["Pending Transfers", useDemoNumber(kpis.pendingTransfers, demoKpis.pendingTransfers), Repeat2, "bg-indigo-50 text-indigo-700", 5],
    ["Upcoming Returns", useDemoNumber(kpis.upcomingReturns, demoKpis.upcomingReturns), Clock, "bg-emerald-50 text-emerald-700", 9],
    ["Overdue Returns", useDemoNumber(kpis.overdueReturns, demoKpis.overdueReturns), Activity, "bg-red-50 text-red-700", -11],
    ["Audit Progress", `${useDemoNumber(kpis.auditProgress, demoKpis.auditProgress)}%`, ClipboardCheck, "bg-slate-100 text-slate-700", 14]
  ];

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />)}</div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Enterprise Dashboard</h1><p className="text-sm text-slate-500">Operational pulse across assets, bookings, maintenance, audits, and transfers.</p></div>
        <div className="flex flex-wrap gap-2">
          <Link className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white shadow-soft transition hover:bg-teal-800" to="/assets"><Plus size={16} /> Register Asset</Link>
          <Link className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800" to="/bookings"><CalendarClock size={16} /> Book Resource</Link>
          <Link className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800" to="/maintenance"><Wrench size={16} /> Raise Maintenance</Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([title, value, icon, tone, trend]) => <KpiCard key={title} title={title} value={value} icon={icon} tone={tone} trend={trend} />)}</div>
      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <section className={chartCard}>
          <h2 className="font-bold">Monthly Allocation</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer><ComposedChart data={monthlyAllocation}><defs><linearGradient id="allocated" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#0f766e" stopOpacity={0.3} /><stop offset="95%" stopColor="#0f766e" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="allocated" stroke="#0f766e" fill="url(#allocated)" /><Line type="monotone" dataKey="returned" stroke="#2563eb" /></ComposedChart></ResponsiveContainer>
          </div>
        </section>
        <section className={chartCard}>
          <h2 className="font-bold">Asset Distribution</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer><PieChart><Pie data={chart} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3} label>{chart.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>
          </div>
        </section>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <section className={chartCard}>
          <h2 className="font-bold">Department Assets</h2>
          <div className="mt-4 h-64"><ResponsiveContainer><BarChart data={departmentAssets}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="assets" fill="#2563eb" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </section>
        <section className={chartCard}>
          <h2 className="font-bold">Maintenance Trend</h2>
          <div className="mt-4 h-64"><ResponsiveContainer><LineChart data={maintenanceTrend}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="requests" stroke="#b45309" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></div>
        </section>
        <section className={chartCard}>
          <h2 className="font-bold">Booking Analytics</h2>
          <div className="mt-4 h-64"><ResponsiveContainer><BarChart data={bookingAnalytics}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="bookings" fill="#0891b2" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </section>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <section className={chartCard}>
          <h2 className="font-bold">Recent Activities</h2>
          <div className="mt-4 grid gap-3">
            {activities.map((item) => (
              <div key={item._id} className="flex gap-3 rounded-md border border-line p-3 text-sm transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-teal-50 font-bold text-brand dark:bg-slate-800">{initials(item.user?.name || "System")}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p><b>{item.user?.name || "System"}</b> {item.action}</p>
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.status || item.module}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.module} - {new Date(item.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className={chartCard}>
          <h2 className="font-bold">Asset Lifecycle</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer><PieChart><Pie data={lifecycle} dataKey="value" nameKey="name" outerRadius={92} label>{lifecycle.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

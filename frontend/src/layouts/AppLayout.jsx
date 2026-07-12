import { Link, NavLink, Outlet } from "react-router-dom";
import { Bell, Boxes, Building2, CalendarClock, ClipboardCheck, Gauge, History, LogOut, Menu, Moon, Repeat2, Search, Settings, ShieldCheck, Sun, Wrench } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/Button";
import { api } from "../services/api";

const navGroups = [
  {
    label: "Operations",
    items: [
      { to: "/", label: "Dashboard", icon: Gauge },
      { to: "/assets", label: "Assets", icon: Boxes },
      { to: "/allocations", label: "Allocations", icon: Repeat2 }
    ]
  },
  {
    label: "Workflows",
    items: [
      { to: "/bookings", label: "Bookings", icon: CalendarClock },
      { to: "/maintenance", label: "Maintenance", icon: Wrench },
      { to: "/audits", label: "Audits", icon: ClipboardCheck }
    ]
  },
  {
    label: "Control",
    items: [
      { to: "/organization", label: "Organization", icon: Building2 },
      { to: "/reports", label: "Reports", icon: ShieldCheck },
      { to: "/activity", label: "Activity", icon: History }
    ]
  }
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = useQuery({ queryKey: ["layout-notifications"], queryFn: async () => (await api.get("/notifications")).data.data, retry: false });
  const unread = (notifications.data || []).filter((item) => !item.readAt).length;
  const initials = user?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "AF";

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDark((value) => !value);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className={`${open ? "fixed inset-y-0 left-0 z-30 block w-72" : "hidden"} border-r border-line bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-950 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-auto lg:shadow-none`}>
        <Link to="/" className="flex items-center gap-2 text-xl font-bold"><span className="rounded-md bg-teal-50 p-2 text-brand"><Boxes size={22} /></span> AssetFlow</Link>
        <nav className="mt-8 grid gap-5">
          {navGroups.map((group) => (
            <div key={group.label} className="grid gap-1">
              <p className="px-3 text-xs font-bold uppercase tracking-wide text-slate-400">{group.label}</p>
              {group.items.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-teal-50 text-brand dark:bg-slate-800" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"}`}>
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute left-0 h-6 w-1 rounded-r bg-brand" />}
                      <Icon size={18} /> {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <main>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur dark:border-slate-700 dark:bg-slate-950/95">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen((value) => !value)}><Menu /></button>
            <div className="hidden h-10 w-80 items-center gap-2 rounded-md border border-line px-3 text-sm text-slate-500 md:flex dark:border-slate-700">
              <Search size={16} />
              <input placeholder="Search assets, people, workflows" className="w-full bg-transparent outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={toggleTheme}>{dark ? <Sun size={16} /> : <Moon size={16} />}</Button>
            <div className="relative">
              <Button variant="secondary" onClick={() => setShowNotifications((value) => !value)}>
                <Bell size={16} />
                {unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-xs text-white">{unread}</span>}
              </Button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg border border-line bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-2 flex items-center justify-between">
                    <b className="text-sm">Notifications</b>
                    <span className="text-xs text-slate-500">{unread} unread</span>
                  </div>
                  <div className="grid max-h-80 gap-2 overflow-y-auto">
                    {(notifications.data || []).slice(0, 5).map((item) => (
                      <div key={item._id} className="rounded-md border border-line p-2 text-sm dark:border-slate-700">
                        <div className="flex items-center justify-between gap-2">
                          <b className="truncate">{item.title}</b>
                          <span className={`rounded px-2 py-0.5 text-xs font-semibold ${item.readAt ? "bg-slate-100 text-slate-500 dark:bg-slate-800" : "bg-amber-50 text-amber-700 dark:bg-amber-950/50"}`}>{item.readAt ? "Read" : "New"}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.message}</p>
                      </div>
                    ))}
                    {!notifications.data?.length && <p className="py-6 text-center text-sm text-slate-500">No notifications yet.</p>}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-teal-50 text-sm font-bold text-brand dark:bg-slate-800">{initials}</div>
              <div className="text-right text-sm"><p className="font-semibold">{user?.name}</p><p className="text-slate-500">{user?.role}</p></div>
            </div>
            <Button variant="secondary" onClick={logout}><LogOut size={16} /></Button>
            <Button variant="secondary"><Settings size={16} /></Button>
          </div>
        </header>
        <section className="p-4 md:p-6"><Outlet /></section>
      </main>
    </div>
  );
}

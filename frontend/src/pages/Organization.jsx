import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { api } from "../services/api";

export default function Organization() {
  const [tab, setTab] = useState("departments");
  const departments = useQuery({ queryKey: ["departments"], queryFn: async () => (await api.get("/organization/departments")).data.data });
  const categories = useQuery({ queryKey: ["categories"], queryFn: async () => (await api.get("/organization/categories")).data.data });
  const employees = useQuery({ queryKey: ["employees"], queryFn: async () => (await api.get("/organization/employees")).data.data });
  const tabs = [
    ["departments", "Departments"],
    ["categories", "Asset Categories"],
    ["employees", "Employee Directory"]
  ];
  return (
    <div className="grid gap-6">
      <div><h1 className="text-2xl font-bold">Organization Setup</h1><p className="text-sm text-slate-500">Admin-only master data: departments, asset categories, employee status, and the only role-promotion surface.</p></div>
      <div className="inline-flex w-fit rounded-md border border-line bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
        {tabs.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`rounded px-3 py-2 text-sm font-semibold ${tab === id ? "bg-brand text-white" : "text-slate-600 dark:text-slate-300"}`}>{label}</button>)}
      </div>
      {tab === "departments" && (
        <section><h2 className="mb-2 font-bold">Department Management</h2><DataTable rows={departments.data || []} columns={[
          { key: "code", label: "Code" },
          { key: "name", label: "Name" },
          { key: "head", label: "Department Head", render: (r) => r.head?.name || "Unassigned" },
          { key: "parentDepartment", label: "Parent", render: (r) => r.parentDepartment?.name || "-" },
          { key: "location", label: "Location" },
          { key: "isActive", label: "Status", render: (r) => r.isActive ? "Active" : "Inactive" }
        ]} /></section>
      )}
      {tab === "categories" && (
        <section><h2 className="mb-2 font-bold">Asset Category Management</h2><DataTable rows={categories.data || []} columns={[
          { key: "name", label: "Name" },
          { key: "warrantyPeriodMonths", label: "Warranty Months" },
          { key: "customFields", label: "Custom Fields", render: (r) => r.customFields?.length || 0 },
          { key: "icon", label: "Icon" },
          { key: "color", label: "Color" }
        ]} /></section>
      )}
      {tab === "employees" && (
        <section><h2 className="mb-2 font-bold">Employee Directory & Role Assignment</h2><DataTable rows={employees.data || []} columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "department", label: "Department", render: (r) => r.department?.name || "Unassigned" },
          { key: "role", label: "Role" },
          { key: "isActive", label: "Status", render: (r) => r.isActive ? "Active" : "Inactive" }
        ]} /></section>
      )}
    </div>
  );
}

import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";

const valueFor = (row, column) => {
  const value = row?.[column.key];
  if (value === undefined || value === null) return "";
  if (typeof value === "object") return value.name || value.title || value.email || "";
  return String(value);
};

export const DataTable = ({ columns, rows = [], empty = "No records found" }) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: columns[0]?.key, direction: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const baseRows = normalizedQuery
      ? rows.filter((row) => columns.some((column) => valueFor(row, column).toLowerCase().includes(normalizedQuery)))
      : rows;

    return [...baseRows].sort((a, b) => {
      const left = valueFor(a, sort);
      const right = valueFor(b, sort);
      return sort.direction === "asc" ? left.localeCompare(right) : right.localeCompare(left);
    });
  }, [columns, query, rows, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const changeSort = (key) => {
    setSort((current) => ({ key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc" }));
  };

  const exportCsv = () => {
    const csv = [
      columns.map((column) => column.label).join(","),
      ...filteredRows.map((row) => columns.map((column) => `"${valueFor(row, column).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "assetflow-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-3 dark:border-slate-700">
        <div className="flex h-10 min-w-64 items-center gap-2 rounded-md border border-line px-3 text-sm text-slate-500 dark:border-slate-700">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search table"
            className="w-full bg-transparent outline-none"
          />
        </div>
        <button type="button" onClick={exportCsv} className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-3 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <Download size={16} /> Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3">
                  <button type="button" onClick={() => changeSort(column.key)} className="inline-flex items-center gap-1 font-bold">
                    {column.label}{sort.key === column.key ? (sort.direction === "asc" ? " Asc" : " Desc") : ""}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length ? visibleRows.map((row) => (
              <tr key={row._id || row.id} className="border-t border-line transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60">
                {columns.map((column) => <td key={column.key} className="px-4 py-3">{column.render ? column.render(row) : row[column.key]}</td>)}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                  <div className="mx-auto grid max-w-sm gap-2">
                    <span className="text-3xl">--</span>
                    <b className="text-slate-700 dark:text-slate-200">{empty}</b>
                    <span className="text-xs">Try adjusting search or filters.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-slate-500 dark:border-slate-700">
        <span>{filteredRows.length} records</span>
        <div className="flex items-center gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-md border border-line px-3 py-1 font-semibold disabled:opacity-40 dark:border-slate-700">Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button type="button" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-md border border-line px-3 py-1 font-semibold disabled:opacity-40 dark:border-slate-700">Next</button>
        </div>
      </div>
    </div>
  );
};

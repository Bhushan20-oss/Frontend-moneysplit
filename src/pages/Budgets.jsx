import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Wallet,
  Pencil,
  Trash2,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import AddBudgetModal from "../components/AddBudgetModal";
import EditBudgetModal from "../components/EditBudgetModal";
import { api } from "../services/api";

const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Budgets() {
  const currentDate = new Date();

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedBudget, setSelectedBudget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.getBudgets();

      const budgetData =
        response?.budgets ||
        response?.data ||
        response ||
        [];

      setBudgets(
        Array.isArray(budgetData) ? budgetData : []
      );
    } catch (err) {
      setError(err.message || "Failed to load budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const filteredBudgets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return budgets.filter((budget) => {
      const matchesMonth =
        Number(budget.month) === Number(selectedMonth);

      const matchesYear =
        Number(budget.year) === Number(selectedYear);

      const matchesSearch =
        !query ||
        String(budget.category || "")
          .toLowerCase()
          .includes(query);

      return (
        matchesMonth &&
        matchesYear &&
        matchesSearch
      );
    });
  }, [
    budgets,
    search,
    selectedMonth,
    selectedYear,
  ]);

  const totals = useMemo(() => {
    return filteredBudgets.reduce(
      (acc, budget) => {
        const amount = Number(budget.amount) || 0;

        acc.total += amount;

        return acc;
      },
      {
        total: 0,
      }
    );
  }, [filteredBudgets]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleEdit = (budget) => {
    setSelectedBudget(budget);
    setIsEditOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api.deleteBudget(id);

      setBudgets((prev) =>
        prev.filter((budget) => budget.id !== id)
      );
    } catch (err) {
      alert(
        err.message || "Failed to delete budget."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getBudgetStatus = (budget) => {
    /*
      The budget API itself only returns the budget fields.
      If your backend later includes spent/remaining values,
      this section can use them directly.
    */

    const spent =
      Number(budget.spent) ||
      Number(budget.used) ||
      0;

    const amount = Number(budget.amount) || 0;

    if (spent > amount) {
      return {
        spent,
        remaining: 0,
        percentage: 100,
        overBudget: true,
      };
    }

    const percentage =
      amount > 0
        ? Math.min((spent / amount) * 100, 100)
        : 0;

    return {
      spent,
      remaining: amount - spent,
      percentage,
      overBudget: false,
    };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64">
        <DashboardHeader />

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Budgets
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Plan how much you want to spend each month.
              </p>
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus size={18} />
              Add Budget
            </button>
          </div>

          {/* Month / Year Filter */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <select
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(Number(e.target.value))
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {monthNames.slice(1).map((month, index) => (
                <option
                  key={month}
                  value={index + 1}
                >
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(Number(e.target.value))
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {[2025, 2026, 2027, 2028, 2029].map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Summary */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Total Budget
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {formatCurrency(totals.total)}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {monthNames[selectedMonth]}{" "}
                    {selectedYear}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <Wallet size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Categories
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {filteredBudgets.length}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Active budgets
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <CheckCircle2 size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search category..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <span>{error}</span>

              <button
                onClick={fetchBudgets}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

              <p className="mt-3 text-sm text-slate-500">
                Loading budgets...
              </p>
            </div>
          ) : filteredBudgets.length === 0 ? (
            /* Empty */
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Wallet size={26} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                No budgets found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Add a budget for{" "}
                {monthNames[selectedMonth]}{" "}
                {selectedYear} to start planning your spending.
              </p>

              <button
                onClick={() => setIsAddOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Plus size={17} />
                Add Budget
              </button>
            </div>
          ) : (
            /* Desktop + Mobile */
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Budget
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Spent
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Remaining
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredBudgets.map((budget) => {
                      const status =
                        getBudgetStatus(budget);

                      return (
                        <tr
                          key={budget.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                                <Wallet size={17} />
                              </div>

                              <span className="font-semibold text-slate-900">
                                {budget.category}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5 font-semibold text-slate-900">
                            {formatCurrency(
                              budget.amount
                            )}
                          </td>

                          <td className="px-6 py-5 text-slate-600">
                            {formatCurrency(
                              status.spent
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={
                                status.overBudget
                                  ? "font-semibold text-red-600"
                                  : "font-semibold text-emerald-600"
                              }
                            >
                              {formatCurrency(
                                status.remaining
                              )}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  handleEdit(budget)
                                }
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                                title="Edit"
                              >
                                <Pencil size={17} />
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    budget.id
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  budget.id
                                }
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredBudgets.map((budget) => {
                  const status =
                    getBudgetStatus(budget);

                  return (
                    <div
                      key={budget.id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                            <Wallet size={17} />
                          </div>

                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {budget.category}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {monthNames[
                                budget.month
                              ]}{" "}
                              {budget.year}
                            </p>
                          </div>
                        </div>

                        <span className="font-semibold text-slate-900">
                          {formatCurrency(
                            budget.amount
                          )}
                        </span>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            Spent
                          </span>

                          <span className="font-medium text-slate-700">
                            {formatCurrency(
                              status.spent
                            )}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              status.overBudget
                                ? "bg-red-500"
                                : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${status.percentage}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-400">
                            Remaining
                          </p>

                          <p
                            className={`mt-1 font-semibold ${
                              status.overBudget
                                ? "text-red-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {formatCurrency(
                              status.remaining
                            )}
                          </p>
                        </div>

                        {status.overBudget && (
                          <div className="flex items-center gap-1 text-xs font-semibold text-red-600">
                            <AlertTriangle size={14} />
                            Over budget
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                        <button
                          onClick={() =>
                            handleEdit(budget)
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              budget.id
                            )
                          }
                          disabled={
                            deletingId === budget.id
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <AddBudgetModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchBudgets}
      />

      <EditBudgetModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedBudget(null);
        }}
        budget={selectedBudget}
        onSuccess={fetchBudgets}
      />
    </div>
  );
}
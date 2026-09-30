import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Receipt,
  Pencil,
  Trash2,
  IndianRupee,
  CalendarDays,
  Utensils,
  Car,
  ShoppingBag,
  Home,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import AddExpenseModal from "../components/AddExpenseModal";
import EditExpenseModal from "../components/EditExpenseModal";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const categoryIcons = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Bills: Home,
  Other: MoreHorizontal,
};

const categoryColors = {
  Food: "bg-orange-50 text-orange-600",
  Transport: "bg-blue-50 text-blue-600",
  Shopping: "bg-purple-50 text-purple-600",
  Bills: "bg-red-50 text-red-600",
  Other: "bg-slate-100 text-slate-600",
};

export default function Expenses() {
  const { user, logout } = useAuth();

  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [addModalOpen, setAddModalOpen] =
    useState(false);

  const [editModalOpen, setEditModalOpen] =
    useState(false);

  const [selectedExpense, setSelectedExpense] =
    useState(null);

  const fetchExpenses = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await api.getExpenses();

      /*
       * Supports common response structures:
       * { expenses: [] }
       * { data: [] }
       * []
       */
      const expenseData =
        response?.expenses ||
        response?.data ||
        (Array.isArray(response)
          ? response
          : []);

      setExpenses(
        Array.isArray(expenseData)
          ? expenseData
          : []
      );
    } catch (err) {
      console.error(
        "Fetch expenses error:",
        err
      );

      setError(
        err.message ||
          "Failed to load expenses."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const filteredExpenses = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return expenses;
    }

    return expenses.filter((expense) => {
      return (
        String(
          expense.category || ""
        )
          .toLowerCase()
          .includes(query) ||
        String(
          expense.description || ""
        )
          .toLowerCase()
          .includes(query) ||
        String(
          expense.amount || ""
        ).includes(query)
      );
    });
  }, [expenses, search]);

  const totalExpense = useMemo(() => {
    return expenses.reduce(
      (total, expense) =>
        total +
        (Number(expense.amount) || 0),
      0
    );
  }, [expenses]);

  const thisMonthTotal = useMemo(() => {
    const now = new Date();

    return expenses.reduce(
      (total, expense) => {
        if (!expense.expenseDate) {
          return total;
        }

        const date = new Date(
          expense.expenseDate
        );

        if (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() ===
            now.getFullYear()
        ) {
          return (
            total +
            (Number(expense.amount) || 0)
          );
        }

        return total;
      },
      0
    );
  }, [expenses]);

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setEditModalOpen(true);
  };

  const handleDelete = async (expense) => {
    const confirmed = window.confirm(
      `Delete this expense of ${formatCurrency(
        expense.amount
      )}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.deleteExpense(
        expense.id
      );

      setExpenses((previous) =>
        previous.filter(
          (item) =>
            item.id !== expense.id
        )
      );
    } catch (err) {
      console.error(
        "Delete expense error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete expense."
      );
    }
  };

  const handleExpenseAdded =
    async () => {
      await fetchExpenses();
      setAddModalOpen(false);
    };

  const handleExpenseUpdated =
    async () => {
      await fetchExpenses();
      setEditModalOpen(false);
      setSelectedExpense(null);
    };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        user={user}
        onLogout={logout}
      />

      <main className="lg:ml-64">
        <DashboardHeader
          onLogout={logout}
        />

        <div className="p-4 sm:p-6 lg:p-8">

          {/* PAGE HEADER */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Receipt size={23} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Expenses
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Track and manage your daily expenses.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setAddModalOpen(true)
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
            >
              <Plus size={18} />

              Add Expense
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>

              <button
                type="button"
                onClick={() =>
                  fetchExpenses()
                }
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* SUMMARY */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Total Expenses
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {formatCurrency(
                      totalExpense
                    )}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Across all recorded expenses
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-3 text-red-600">
                  <IndianRupee size={21} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    This Month
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {formatCurrency(
                      thisMonthTotal
                    )}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Current month's expenses
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <CalendarDays size={21} />
                </div>
              </div>
            </div>

          </div>

          {/* SEARCH / TOOLBAR */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="relative w-full sm:max-w-md">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search expenses..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                fetchExpenses(true)
              }
              disabled={refreshing}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>

          {/* EXPENSE LIST */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* DESKTOP HEADER */}
            <div className="hidden border-b border-slate-200 bg-slate-50 px-6 py-4 md:grid md:grid-cols-[2fr_1fr_2fr_1.2fr_100px] md:items-center md:gap-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Expense
              </p>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </p>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Description
              </p>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Date
              </p>

              <p className="text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Action
              </p>
            </div>

            {loading ? (
              <div className="p-10 text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading expenses...
                </p>
              </div>
            ) : filteredExpenses.length ===
              0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Receipt size={26} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  {search
                    ? "No expenses found"
                    : "No expenses yet"}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  {search
                    ? "Try a different search term."
                    : "Start recording your expenses to see them here."}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={() =>
                      setAddModalOpen(
                        true
                      )
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
                  >
                    <Plus size={17} />

                    Add your first expense
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredExpenses.map(
                  (expense) => {
                    const Icon =
                      categoryIcons[
                        expense.category
                      ] ||
                      MoreHorizontal;

                    const iconColor =
                      categoryColors[
                        expense.category
                      ] ||
                      categoryColors.Other;

                    return (
                      <div
                        key={expense.id}
                        className="group px-4 py-4 transition hover:bg-slate-50 sm:px-6 md:grid md:grid-cols-[2fr_1fr_2fr_1.2fr_100px] md:items-center md:gap-4"
                      >
                        {/* EXPENSE */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColor}`}
                          >
                            <Icon size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">
                              {formatCurrency(
                                expense.amount
                              )}
                            </p>

                            <p className="text-xs text-slate-400">
                              Expense #{expense.id}
                            </p>
                          </div>
                        </div>

                        {/* CATEGORY */}
                        <div className="mt-3 md:mt-0">
                          <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {expense.category ||
                              "Other"}
                          </span>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="mt-3 min-w-0 md:mt-0">
                          <p className="truncate text-sm text-slate-600">
                            {expense.description ||
                              "No description"}
                          </p>
                        </div>

                        {/* DATE */}
                        <div className="mt-3 md:mt-0">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays
                              size={15}
                            />

                            {formatDate(
                              expense.expenseDate
                            )}
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-4 flex justify-end gap-2 md:mt-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                expense
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                            title="Edit expense"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                expense
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            title="Delete expense"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ADD EXPENSE MODAL */}
      <AddExpenseModal
        isOpen={addModalOpen}
        onClose={() =>
          setAddModalOpen(false)
        }
        onExpenseAdded={
          handleExpenseAdded
        }
      />

      {/* EDIT EXPENSE MODAL */}
      <EditExpenseModal
        isOpen={editModalOpen}
        expense={selectedExpense}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedExpense(null);
        }}
        onExpenseUpdated={
          handleExpenseUpdated
        }
      />
    </div>
  );
}
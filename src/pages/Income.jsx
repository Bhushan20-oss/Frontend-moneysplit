import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  CalendarDays,
  Edit3,
  IndianRupee,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import AddIncomeModal from "../components/AddIncomeModal";
import EditIncomeModal from "../components/EditIncomeModal";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Income() {
  const { user, logout } = useAuth();

  const today = new Date();

  const [income, setIncome] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [selectedIncome, setSelectedIncome] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const [month, setMonth] = useState(
    today.getMonth() + 1
  );

  const [year, setYear] = useState(
    today.getFullYear()
  );

  /* =======================================================
     LOAD INCOME
  ======================================================= */

  const loadIncome = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.getIncome();

      console.log("Income API response:", response);

      /*
       * Supports common response structures:
       *
       * { income: [...] }
       * { incomes: [...] }
       * { data: [...] }
       * [...]
       */

      let records = [];

      if (Array.isArray(response)) {
        records = response;
      } else if (Array.isArray(response?.income)) {
        records = response.income;
      } else if (Array.isArray(response?.incomes)) {
        records = response.incomes;
      } else if (Array.isArray(response?.data)) {
        records = response.data;
      }

      setIncome(records);
    } catch (err) {
      console.error("Income loading error:", err);

      setError(
        err.message || "Unable to load income."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadIncome();
  }, [loadIncome]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredIncome = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return income;
    }

    return income.filter((item) => {
      const source = String(
        item.source || ""
      ).toLowerCase();

      const description = String(
        item.description || ""
      ).toLowerCase();

      const amount = String(
        item.amount || ""
      ).toLowerCase();

      return (
        source.includes(query) ||
        description.includes(query) ||
        amount.includes(query)
      );
    });
  }, [income, search]);

  /* =======================================================
     TOTAL
  ======================================================= */

  const totalIncome = useMemo(() => {
    return income.reduce(
      (total, item) =>
        total + Number(item.amount || 0),
      0
    );
  }, [income]);

  /* =======================================================
     ADD
  ======================================================= */

  const handleAddIncome = () => {
    setAddOpen(true);
  };

  const handleIncomeAdded = async () => {
    setAddOpen(false);

    await loadIncome(true);
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (item) => {
    setSelectedIncome(item);
    setEditOpen(true);
  };

  const handleIncomeUpdated = async () => {
    setEditOpen(false);
    setSelectedIncome(null);

    await loadIncome(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedIncome(null);
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete this income of ${formatCurrency(
        item.amount
      )}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.id);
      setError("");

      await api.deleteIncome(item.id);

      await loadIncome(true);
    } catch (err) {
      console.error("Delete income error:", err);

      setError(
        err.message || "Failed to delete income."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =======================================================
     MONTH CHANGE
  ======================================================= */

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="fixed inset-y-0 left-0 hidden w-64 bg-slate-950 lg:block" />

        <main className="lg:ml-64">

          <div className="h-20 border-b border-slate-200 bg-white" />

          <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">

            <div className="space-y-3">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-9 w-48 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-4 w-80 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div className="h-36 animate-pulse rounded-2xl bg-slate-200" />

              <div className="h-36 animate-pulse rounded-2xl bg-slate-200" />

            </div>

            <div className="h-[500px] animate-pulse rounded-2xl bg-slate-200" />

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <Sidebar
        user={user}
        onLogout={logout}
      />

      <div className="min-h-screen lg:ml-64">

        {/* =================================================
            TOP HEADER
        ================================================= */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                MoneySplit
              </p>

              <h2 className="text-lg font-bold text-slate-900">
                Income
              </h2>
            </div>

            <div className="flex items-center gap-2">

              {/* Refresh */}
              <button
                type="button"
                onClick={() => loadIncome(true)}
                disabled={refreshing}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw
                  size={18}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>

              {/* Add */}
              <button
                type="button"
                onClick={handleAddIncome}
                className="hidden items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 sm:flex"
              >
                <Plus size={19} />
                Add Income
              </button>

            </div>

          </div>

        </header>

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="mx-auto max-w-[1400px] px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8">

          {/* Page heading */}
          <div className="mb-8">

            <p className="mb-1 text-sm font-medium text-emerald-600">
              Financial management
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Income
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Track and manage all the money coming into your account.
                </p>
              </div>

              {/* Desktop add */}
              <button
                type="button"
                onClick={handleAddIncome}
                className="hidden items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 sm:flex"
              >
                <Plus size={19} />
                Add Income
              </button>

            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">

              <div>
                <p className="font-semibold text-red-700">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => loadIncome()}
                className="text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>

            </div>
          )}

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="mb-7 grid gap-5 md:grid-cols-2">

            {/* Total income */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Total Income
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-600">
                    {formatCurrency(totalIncome)}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    {income.length}{" "}
                    {income.length === 1
                      ? "income entry"
                      : "income entries"}
                  </p>

                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <TrendingUp size={25} />
                </div>

              </div>

            </div>

            {/* Current period */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Current Period
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {new Date(
                      year,
                      month - 1,
                      1
                    ).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Manage your income records
                  </p>

                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <CalendarDays size={25} />
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              INCOME TABLE
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Table header */}
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Income History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage your income records.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search income..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

              </div>

            </div>

            {/* Empty */}
            {filteredIncome.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

                <div className="mb-5 rounded-2xl bg-emerald-50 p-5 text-emerald-600">
                  <ArrowDownLeft size={32} />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {search
                    ? "No income found"
                    : "No income recorded yet"}
                </h3>

                <p className="mt-2 max-w-md text-sm text-slate-500">
                  {search
                    ? "Try a different search term."
                    : "Start tracking your money by adding your first income entry."}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={handleAddIncome}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600"
                  >
                    <Plus size={18} />
                    Add Income
                  </button>
                )}

              </div>
            ) : (

              /* Table */
              <div className="overflow-x-auto">

                <table className="w-full min-w-[760px]">

                  <thead>

                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                      <th className="px-5 py-4">
                        Source
                      </th>

                      <th className="px-5 py-4">
                        Description
                      </th>

                      <th className="px-5 py-4">
                        Date
                      </th>

                      <th className="px-5 py-4 text-right">
                        Amount
                      </th>

                      <th className="px-5 py-4 text-right">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredIncome.map((item) => (

                      <tr
                        key={item.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                      >

                        {/* Source */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                              <IndianRupee size={18} />
                            </div>

                            <span className="font-semibold text-slate-900">
                              {item.source || "Other"}
                            </span>

                          </div>

                        </td>

                        {/* Description */}
                        <td className="px-5 py-4 text-sm text-slate-500">
                          {item.description || "—"}
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(item.incomeDate)}
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4 text-right">

                          <span className="font-bold text-emerald-600">
                            +{formatCurrency(item.amount)}
                          </span>

                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(item)
                              }
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                              title="Edit income"
                            >
                              <Edit3 size={17} />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(item)
                              }
                              disabled={
                                deletingId === item.id
                              }
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Delete income"
                            >
                              {deletingId === item.id ? (
                                <RefreshCw
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </main>

      </div>

      {/* ===================================================
          MOBILE ADD BUTTON
      =================================================== */}

      <button
        type="button"
        onClick={handleAddIncome}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 sm:hidden"
        aria-label="Add income"
      >
        <Plus size={25} />
      </button>

      {/* ===================================================
          ADD MODAL
      =================================================== */}

      <AddIncomeModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onIncomeAdded={handleIncomeAdded}
      />

      {/* ===================================================
          EDIT MODAL
      =================================================== */}

      {selectedIncome && (
        <EditIncomeModal
          isOpen={editOpen}
          income={selectedIncome}
          onClose={handleCloseEdit}
          onIncomeUpdated={handleIncomeUpdated}
        />
      )}

    </div>
  );
}
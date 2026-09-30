import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Edit3,
  IndianRupee,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  TrendingUp,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import AddSavingModal from "../components/AddSavingModal";
import EditSavingModal from "../components/EditSavingModal";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

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

export default function Savings() {
  const { user, logout } = useAuth();

  const today = new Date();

  const [savings, setSavings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [selectedSaving, setSelectedSaving] =
    useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const [month, setMonth] = useState(
    today.getMonth() + 1
  );

  const [year, setYear] = useState(
    today.getFullYear()
  );

  /* =======================================================
     LOAD SAVINGS
  ======================================================= */

  const loadSavings = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.getSavings();

      console.log("Savings API response:", response);

      let records = [];

      if (Array.isArray(response)) {
        records = response;
      } else if (Array.isArray(response?.savings)) {
        records = response.savings;
      } else if (Array.isArray(response?.saving)) {
        records = response.saving;
      } else if (Array.isArray(response?.data)) {
        records = response.data;
      }

      setSavings(records);
    } catch (err) {
      console.error("Savings loading error:", err);

      setError(
        err.message || "Unable to load savings."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSavings();
  }, [loadSavings]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredSavings = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return savings;
    }

    return savings.filter((item) => {
      const type = String(
        item.savingType || ""
      ).toLowerCase();

      const description = String(
        item.description || ""
      ).toLowerCase();

      const amount = String(
        item.amount || ""
      ).toLowerCase();

      return (
        type.includes(query) ||
        description.includes(query) ||
        amount.includes(query)
      );
    });
  }, [savings, search]);

  /* =======================================================
     TOTAL SAVINGS
  ======================================================= */

  const totalSavings = useMemo(() => {
    return savings.reduce(
      (total, item) =>
        total + Number(item.amount || 0),
      0
    );
  }, [savings]);

  /* =======================================================
     ADD
  ======================================================= */

  const handleAddSaving = () => {
    setAddOpen(true);
  };

  const handleSavingAdded = async () => {
    setAddOpen(false);

    await loadSavings(true);
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (item) => {
    setSelectedSaving(item);
    setEditOpen(true);
  };

  const handleSavingUpdated = async () => {
    setEditOpen(false);
    setSelectedSaving(null);

    await loadSavings(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedSaving(null);
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete this saving of ${formatCurrency(
        item.amount
      )}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.id);
      setError("");

      await api.deleteSaving(item.id);

      await loadSavings(true);
    } catch (err) {
      console.error("Delete saving error:", err);

      setError(
        err.message || "Failed to delete saving."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =======================================================
     MONTH
  ======================================================= */

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  /* =======================================================
     LOADING
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

      <Sidebar
        user={user}
        onLogout={logout}
      />

      <div className="min-h-screen lg:ml-64">

        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                MoneySplit
              </p>

              <h2 className="text-lg font-bold text-slate-900">
                Savings
              </h2>
            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() => loadSavings(true)}
                disabled={refreshing}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
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

              <button
                type="button"
                onClick={handleAddSaving}
                className="hidden items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 sm:flex"
              >
                <Plus size={19} />
                Add Saving
              </button>

            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8">

          {/* Heading */}
          <div className="mb-8">

            <p className="mb-1 text-sm font-medium text-emerald-600">
              Financial management
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Savings
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Track the money you are setting aside for your future.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSaving}
                className="hidden items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-600 sm:flex"
              >
                <Plus size={19} />
                Add Saving
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
                onClick={() => loadSavings()}
                className="text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>

            </div>
          )}

          {/* Summary */}
          <div className="mb-7 grid gap-5 md:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Savings
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-600">
                    {formatCurrency(totalSavings)}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    {savings.length}{" "}
                    {savings.length === 1
                      ? "saving entry"
                      : "saving entries"}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <TrendingUp size={25} />
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Current Period
                  </p>

                  <p className="mt-2 text-2xl font-bold">
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
                    Manage your saving records
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <CalendarDays size={25} />
                </div>

              </div>
            </div>

          </div>

          {/* Table */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-bold">
                  Savings History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage your saving records.
                </p>
              </div>

              <div className="relative w-full sm:w-72">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search savings..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

              </div>
            </div>

            {filteredSavings.length === 0 ? (

              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

                <div className="mb-5 rounded-2xl bg-emerald-50 p-5 text-emerald-600">
                  <ShieldCheck size={32} />
                </div>

                <h3 className="text-lg font-bold">
                  {search
                    ? "No savings found"
                    : "No savings recorded yet"}
                </h3>

                <p className="mt-2 max-w-md text-sm text-slate-500">
                  {search
                    ? "Try a different search term."
                    : "Start building your savings by adding your first saving entry."}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={handleAddSaving}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-600"
                  >
                    <Plus size={18} />
                    Add Saving
                  </button>
                )}

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[760px]">

                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                      <th className="px-5 py-4">
                        Saving Type
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

                    {filteredSavings.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                      >

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                              <ShieldCheck size={18} />
                            </div>

                            <span className="font-semibold">
                              {item.savingType || "Other"}
                            </span>

                          </div>

                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {item.description || "—"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(item.savingDate)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span className="font-bold text-emerald-600">
                            {formatCurrency(item.amount)}
                          </span>
                        </td>

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(item)
                              }
                              className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                              title="Edit saving"
                            >
                              <Edit3 size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(item)
                              }
                              disabled={
                                deletingId === item.id
                              }
                              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              title="Delete saving"
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

      {/* Mobile button */}
      <button
        type="button"
        onClick={handleAddSaving}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 sm:hidden"
        aria-label="Add saving"
      >
        <Plus size={25} />
      </button>

      {/* Add modal */}
      <AddSavingModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSavingAdded={handleSavingAdded}
      />

      {/* Edit modal */}
      {selectedSaving && (
        <EditSavingModal
          isOpen={editOpen}
          saving={selectedSaving}
          onClose={handleCloseEdit}
          onSavingUpdated={handleSavingUpdated}
        />
      )}

    </div>
  );
}
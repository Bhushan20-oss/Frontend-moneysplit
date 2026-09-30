import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  Plus,
} from "lucide-react";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import SummaryCards from "../components/dashboard/SummaryCards";
import SpendingOverview from "../components/dashboard/SpendingOverview";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import BudgetOverview from "../components/dashboard/BudgetOverview";
import BillsOverview from "../components/dashboard/BillsOverview";

import AddExpenseModal from "../components/AddExpenseModal";
import EditExpenseModal from "../components/EditExpenseModal";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const today = new Date();

  const [month, setMonth] = useState(
    today.getMonth() + 1
  );

  const [year, setYear] = useState(
    today.getFullYear()
  );

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [addOpen, setAddOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [selectedExpense, setSelectedExpense] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  const loadDashboard = useCallback(
    async (silent = false) => {
      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response =
          await api.getDashboard(
            month,
            year
          );

        console.log(
          "Dashboard API:",
          response
        );

        setDashboard(
          response?.dashboard || {}
        );
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err.message ||
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [month, year]
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // =========================================================
  // ADD EXPENSE
  // =========================================================

  const handleAddExpense = () => {
    setAddOpen(true);
  };

  const handleExpenseAdded = async () => {
    setAddOpen(false);

    await loadDashboard(true);
  };

  // =========================================================
  // EDIT EXPENSE
  // =========================================================

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setEditOpen(true);
  };

  const handleExpenseUpdated = async () => {
    setEditOpen(false);
    setSelectedExpense(null);

    await loadDashboard(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedExpense(null);
  };

  // =========================================================
  // DELETE EXPENSE
  // =========================================================

  const handleDelete = async (expense) => {
    const confirmed = window.confirm(
      `Delete this expense of ₹${Number(
        expense.amount || 0
      ).toLocaleString("en-IN")}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(expense.id);
      setError("");

      await api.deleteExpense(
        expense.id
      );

      await loadDashboard(true);
    } catch (err) {
      console.error(
        "Delete expense error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete expense."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // MONTH CHANGE
  // =========================================================

  const handleMonthChange = (
    newMonth,
    newYear
  ) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="fixed inset-y-0 left-0 hidden w-64 bg-slate-950 lg:block" />

        <main className="lg:ml-64">

          <div className="h-20 border-b border-slate-200 bg-white" />

          <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">

            <div className="space-y-3">

              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

              <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />

              <div className="h-4 w-80 animate-pulse rounded bg-slate-200" />

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-2xl bg-slate-200"
                  />
                )
              )}

            </div>

            <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />

            <div className="grid gap-6 xl:grid-cols-2">

              <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />

              <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />

            </div>

          </div>

        </main>

      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* SIDEBAR */}

      <Sidebar
        user={user}
        onLogout={logout}
      />

      {/* MAIN */}

      <div className="min-h-screen lg:ml-64">

        {/* HEADER */}

        <DashboardHeader
          month={month}
          year={year}
          onChangeMonth={
            handleMonthChange
          }
          onRefresh={() =>
            loadDashboard(true)
          }
          refreshing={refreshing}
          onAddExpense={
            handleAddExpense
          }
          onLogout={logout}
        />

        {/* CONTENT */}

        <main className="mx-auto max-w-[1400px] px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8">

          {/* WELCOME */}

          <WelcomeSection
            user={user}
            month={month}
            year={year}
          />

          {/* ERROR */}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div className="flex-1">

                <p className="font-semibold text-red-700">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    loadDashboard()
                  }
                  className="mt-3 text-sm font-semibold text-red-700 underline"
                >
                  Try again
                </button>

              </div>

            </div>
          )}

          {/* =================================================
              SUMMARY
          ================================================= */}

          <SummaryCards
            summary={
              dashboard?.summary || {}
            }
          />

          {/* =================================================
              SPENDING OVERVIEW
          ================================================= */}

          <SpendingOverview
            expenseByCategory={
              dashboard?.breakdown
                ?.expenseByCategory || {}
            }
          />

          {/* =================================================
              TRANSACTIONS
          ================================================= */}

          <div className="mt-7">

            <RecentTransactions
              recent={
                dashboard?.recent || {}
              }
              onEdit={handleEdit}
              onDelete={handleDelete}
              deletingId={deletingId}
            />

          </div>

          {/* =================================================
              BUDGET + BILLS
          ================================================= */}

          <div className="mt-7 grid gap-6 xl:grid-cols-2">

            <BudgetOverview
              budget={
                dashboard?.budget || {}
              }
            />

            <BillsOverview
              bills={
                dashboard?.bills || {}
              }
              upcomingBills={
                dashboard?.upcomingBills || []
              }
            />

          </div>

        </main>

      </div>

      {/* =====================================================
          MOBILE ADD BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={handleAddExpense}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 sm:hidden"
        aria-label="Add expense"
      >
        <Plus size={25} />
      </button>

      {/* =====================================================
          ADD EXPENSE MODAL
      ===================================================== */}

      <AddExpenseModal
        isOpen={addOpen}
        onClose={() =>
          setAddOpen(false)
        }
        onExpenseAdded={
          handleExpenseAdded
        }
      />

      {/* =====================================================
          EDIT EXPENSE MODAL
      ===================================================== */}

      {selectedExpense && (
        <EditExpenseModal
          isOpen={editOpen}
          expense={selectedExpense}
          onClose={handleCloseEdit}
          onExpenseUpdated={
            handleExpenseUpdated
          }
        />
      )}

    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Receipt,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock3,
  AlertCircle,
  IndianRupee,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import AddBillModal from "../components/AddBillModal";
import EditBillModal from "../components/EditBillModal";
import { api } from "../services/api";

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedBill, setSelectedBill] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.getBills();

      const billData =
        response?.bills ||
        response?.data ||
        response ||
        [];

      setBills(Array.isArray(billData) ? billData : []);
    } catch (err) {
      setError(err.message || "Failed to load bills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const filteredBills = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return bills;

    return bills.filter((bill) => {
      return (
        String(bill.billName || "")
          .toLowerCase()
          .includes(query) ||
        String(bill.category || "")
          .toLowerCase()
          .includes(query) ||
        String(bill.status || "")
          .toLowerCase()
          .includes(query) ||
        String(bill.description || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [bills, search]);

  const totals = useMemo(() => {
    return bills.reduce(
      (acc, bill) => {
        const amount = Number(bill.amount) || 0;

        acc.total += amount;

        if (bill.status === "PAID") {
          acc.paid += amount;
        }

        if (bill.status === "PENDING") {
          acc.pending += amount;
        }

        if (bill.status === "OVERDUE") {
          acc.overdue += amount;
        }

        return acc;
      },
      {
        total: 0,
        paid: 0,
        pending: 0,
        overdue: 0,
      }
    );
  }, [bills]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "OVERDUE":
        return "bg-red-50 text-red-700 border-red-200";

      case "PENDING":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return <CheckCircle2 size={14} />;

      case "OVERDUE":
        return <AlertCircle size={14} />;

      default:
        return <Clock3 size={14} />;
    }
  };

  const handleEdit = (bill) => {
    setSelectedBill(bill);
    setIsEditOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bill?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api.deleteBill(id);

      setBills((prev) => prev.filter((bill) => bill.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete bill.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (bill, status) => {
    if (bill.status === status) return;

    try {
      setUpdatingStatusId(bill.id);

      const payload = {
        billName: bill.billName,
        amount: Number(bill.amount),
        category: bill.category,
        dueDate: String(bill.dueDate).split("T")[0],
        status,
        description: bill.description || "",
      };

      const response = await api.updateBill(bill.id, payload);

      const updatedBill =
        response?.bill ||
        response?.data ||
        null;

      setBills((prev) =>
        prev.map((item) =>
          item.id === bill.id
            ? updatedBill || {
                ...item,
                status,
              }
            : item
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update bill status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64">
        <DashboardHeader />

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Bills
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Keep track of your upcoming and paid bills.
              </p>
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus size={18} />
              Add Bill
            </button>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Total */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Total Bills
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {formatCurrency(totals.total)}
                  </h2>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Receipt size={22} />
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Pending
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-amber-600">
                    {formatCurrency(totals.pending)}
                  </h2>
                </div>

                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Clock3 size={22} />
                </div>
              </div>
            </div>

            {/* Paid */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Paid
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-emerald-600">
                    {formatCurrency(totals.paid)}
                  </h2>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <CheckCircle2 size={22} />
                </div>
              </div>
            </div>

            {/* Overdue */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Overdue
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-red-600">
                    {formatCurrency(totals.overdue)}
                  </h2>
                </div>

                <div className="rounded-xl bg-red-50 p-3 text-red-600">
                  <AlertCircle size={22} />
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bills..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <span>{error}</span>

              <button
                onClick={fetchBills}
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
                Loading bills...
              </p>
            </div>
          ) : filteredBills.length === 0 ? (
            /* Empty */
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Receipt size={26} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {search ? "No bills found" : "No bills yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {search
                  ? "Try searching with a different bill name or category."
                  : "Add your first bill to start tracking your payments."}
              </p>

              {!search && (
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <Plus size={17} />
                  Add Bill
                </button>
              )}
            </div>
          ) : (
            /* Bills */
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Bill
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Due Date
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredBills.map((bill) => (
                      <tr
                        key={bill.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {bill.billName}
                            </p>

                            {bill.description && (
                              <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                {bill.description}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {bill.category}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 font-semibold text-slate-900">
                            <IndianRupee size={14} />
                            {Number(bill.amount || 0).toLocaleString(
                              "en-IN"
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(bill.dueDate)}
                        </td>

                        <td className="px-6 py-4">
                          <select
                            value={bill.status}
                            disabled={updatingStatusId === bill.id}
                            onChange={(e) =>
                              handleStatusChange(
                                bill,
                                e.target.value
                              )
                            }
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none ${getStatusStyle(
                              bill.status
                            )}`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="OVERDUE">Overdue</option>
                          </select>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(bill)}
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                              title="Edit"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(bill.id)
                              }
                              disabled={deletingId === bill.id}
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredBills.map((bill) => (
                  <div key={bill.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {bill.billName}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {bill.category}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 font-semibold text-slate-900">
                        <IndianRupee size={14} />
                        {Number(bill.amount || 0).toLocaleString(
                          "en-IN"
                        )}
                      </div>
                    </div>

                    {bill.description && (
                      <p className="mt-3 text-sm text-slate-500">
                        {bill.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-400">
                          Due Date
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {formatDate(bill.dueDate)}
                        </p>
                      </div>

                      <select
                        value={bill.status}
                        disabled={updatingStatusId === bill.id}
                        onChange={(e) =>
                          handleStatusChange(
                            bill,
                            e.target.value
                          )
                        }
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none ${getStatusStyle(
                          bill.status
                        )}`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="OVERDUE">Overdue</option>
                      </select>
                    </div>

                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(bill.id)}
                        disabled={deletingId === bill.id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <AddBillModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchBills}
      />

      <EditBillModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedBill(null);
        }}
        bill={selectedBill}
        onSuccess={fetchBills}
      />
    </div>
  );
}
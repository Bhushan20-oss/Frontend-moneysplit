import { useEffect, useState } from "react";
import { X, Wallet, IndianRupee } from "lucide-react";
import { api } from "../services/api";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function EditBudgetModal({
  isOpen,
  onClose,
  budget,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: "",
    year: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category || "",
        amount: budget.amount ?? "",
        month: budget.month ?? "",
        year: budget.year ?? "",
      });
    }
  }, [budget]);

  if (!isOpen || !budget) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "month" || name === "year"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }

    try {
      setLoading(true);

      const budgetData = {
        category: formData.category.trim(),
        amount: Number(formData.amount),
        month: Number(formData.month),
        year: Number(formData.year),
      };

      await api.updateBudget(budget.id, budgetData);

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update budget.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">
              <Wallet size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Edit Budget
              </h2>

              <p className="text-sm text-slate-500">
                Update your budget
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Budget Amount
            </label>

            <div className="relative">
              <IndianRupee
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Month */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Month
            </label>

            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Year
            </label>

            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="2000"
              max="2100"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
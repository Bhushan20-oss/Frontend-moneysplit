import { useState } from "react";
import {
  X,
  IndianRupee,
  Briefcase,
  Laptop,
  Gift,
  TrendingUp,
  MoreHorizontal,
  CalendarDays,
} from "lucide-react";

import { api } from "../services/api";

const sources = [
  { name: "Salary", icon: Briefcase },
  { name: "Freelance", icon: Laptop },
  { name: "Bonus", icon: Gift },
  { name: "Investment", icon: TrendingUp },
  { name: "Other", icon: MoreHorizontal },
];

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function AddIncomeModal({
  isOpen,
  onClose,
  onIncomeAdded,
}) {
  const [formData, setFormData] = useState({
    amount: "",
    source: "Salary",
    description: "",
    incomeDate: getToday(),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSourceChange = (source) => {
    setFormData((previous) => ({
      ...previous,
      source,
    }));
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      source: "Salary",
      description: "",
      incomeDate: getToday(),
    });

    setError("");
  };

  const handleClose = () => {
    if (loading) return;

    resetForm();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const amount = Number(formData.amount);

    if (!formData.amount) {
      setError("Please enter an amount.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (!formData.source) {
      setError("Please select an income source.");
      return;
    }

    if (!formData.incomeDate) {
      setError("Please select an income date.");
      return;
    }

    try {
      setLoading(true);

      const incomeData = {
        amount,
        source: formData.source,
        description: formData.description.trim(),
        incomeDate: formData.incomeDate,
      };

      console.log("Adding income:", incomeData);

      await api.addIncome(incomeData);

      console.log("Income added successfully");

      resetForm();

      if (onIncomeAdded) {
        await onIncomeAdded();
      }

      onClose();
    } catch (err) {
      console.error("Add income error:", err);

      setError(
        err.message || "Failed to add income. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Add Income
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Record money that you received.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Amount
            </label>

            <div className="relative">

              <IndianRupee
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={loading}
                autoFocus
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-lg font-semibold outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />

            </div>
          </div>

          {/* Source */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Income Source
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

              {sources.map((item) => {
                const Icon = item.icon;
                const selected = formData.source === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() =>
                      handleSourceChange(item.name)
                    }
                    disabled={loading}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      selected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={17} />
                    {item.name}
                  </button>
                );
              })}

            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. September salary"
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Income Date
            </label>

            <div className="relative">

              <CalendarDays
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                name="incomeDate"
                value={formData.incomeDate}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />

            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 border-t border-slate-100 pt-5">

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Income"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
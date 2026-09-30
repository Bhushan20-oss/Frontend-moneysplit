import { useState } from "react";
import {
  X,
  IndianRupee,
  Utensils,
  Car,
  ShoppingBag,
  Home,
  MoreHorizontal,
  CalendarDays,
} from "lucide-react";

import { api } from "../services/api";

const categories = [
  {
    name: "Food",
    icon: Utensils,
  },
  {
    name: "Transport",
    icon: Car,
  },
  {
    name: "Shopping",
    icon: ShoppingBag,
  },
  {
    name: "Bills",
    icon: Home,
  },
  {
    name: "Other",
    icon: MoreHorizontal,
  },
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

const initialForm = {
  amount: "",
  category: "Food",
  description: "",
  expenseDate: getToday(),
};

export default function AddExpenseModal({
  isOpen,
  onClose,
  onExpenseAdded,
}) {
  const [formData, setFormData] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleCategoryChange = (category) => {
    setFormData((previous) => ({
      ...previous,
      category,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    const amount = Number(formData.amount);

    if (!formData.amount) {
      setError("Please enter an amount.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError(
        "Amount must be greater than 0."
      );
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.expenseDate) {
      setError(
        "Please select an expense date."
      );
      return;
    }

    try {
      setLoading(true);

      const expenseData = {
        amount,
        category: formData.category,
        description:
          formData.description.trim(),
        expenseDate: formData.expenseDate,
      };

      console.log(
        "Creating expense:",
        expenseData
      );

      const response =
        await api.addExpense(
          expenseData
        );

      console.log(
        "Expense created:",
        response
      );

      setFormData({
        ...initialForm,
        expenseDate: getToday(),
      });

      if (onExpenseAdded) {
        await onExpenseAdded();
      } else {
        onClose();
      }
    } catch (err) {
      console.error(
        "Add expense error:",
        err
      );

      setError(
        err.message ||
          "Failed to add expense."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* BACKDROP */}

      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* MODAL */}

      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Add Expense
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Record where your money went.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          {/* ERROR */}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* AMOUNT */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Amount
            </label>

            <div className="relative">

              <IndianRupee
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                autoFocus
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-lg font-semibold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50"
              />

            </div>

          </div>

          {/* CATEGORY */}

          <div>

            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Category
            </label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">

              {categories.map((item) => {
                const Icon = item.icon;

                const selected =
                  formData.category ===
                  item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      handleCategoryChange(
                        item.name
                      )
                    }
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border px-2 py-3 transition ${
                      selected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <Icon size={19} />

                    <span className="text-xs font-medium">
                      {item.name}
                    </span>
                  </button>
                );
              })}

            </div>

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
              <span className="font-normal text-slate-400">
                {" "}
                (optional)
              </span>
            </label>

            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Lunch at restaurant"
              maxLength={200}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50"
            />

          </div>

          {/* DATE */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Expense Date
            </label>

            <div className="relative">

              <CalendarDays
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50"
              />

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
            >
              {loading
                ? "Saving..."
                : "Save Expense"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
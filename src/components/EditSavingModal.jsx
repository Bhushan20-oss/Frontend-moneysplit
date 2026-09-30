import { useEffect, useState } from "react";
import {
  X,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  Target,
  Home,
  MoreHorizontal,
  CalendarDays,
} from "lucide-react";

import { api } from "../services/api";

const savingTypes = [
  { name: "Emergency Fund", icon: ShieldCheck },
  { name: "Investment", icon: TrendingUp },
  { name: "Goal", icon: Target },
  { name: "Home", icon: Home },
  { name: "Other", icon: MoreHorizontal },
];

export default function EditSavingModal({
  isOpen,
  saving,
  onClose,
  onSavingUpdated,
}) {
  const [formData, setFormData] = useState({
    amount: "",
    savingType: "Emergency Fund",
    description: "",
    savingDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!saving) return;

    setFormData({
      amount: saving.amount ?? "",
      savingType:
        saving.savingType ?? "Emergency Fund",
      description: saving.description ?? "",
      savingDate: saving.savingDate
        ? String(saving.savingDate).slice(0, 10)
        : "",
    });

    setError("");
  }, [saving]);

  if (!isOpen || !saving) return null;

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amount = Number(formData.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (!formData.savingType) {
      setError("Please select a saving type.");
      return;
    }

    if (!formData.savingDate) {
      setError("Please select a saving date.");
      return;
    }

    try {
      setLoading(true);

      const savingData = {
        amount,
        savingType: formData.savingType,
        description: formData.description.trim(),
        savingDate: formData.savingDate,
      };

      console.log("Updating saving:", savingData);

      await api.updateSaving(saving.id, savingData);

      if (onSavingUpdated) {
        await onSavingUpdated();
      }

      onClose();
    } catch (err) {
      console.error("Update saving error:", err);

      setError(
        err.message || "Failed to update saving."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Edit Saving
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your saving entry.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

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
                min="0"
                step="0.01"
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-lg font-semibold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Saving Type
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {savingTypes.map((item) => {
                const Icon = item.icon;
                const selected =
                  formData.savingType === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setFormData((previous) => ({
                        ...previous,
                        savingType: item.name,
                      }))
                    }
                    className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium ${
                      selected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={17} />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Saving Date
            </label>

            <div className="relative">
              <CalendarDays
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                name="savingDate"
                value={formData.savingDate}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          <div className="flex gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              {loading
                ? "Updating..."
                : "Update Saving"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
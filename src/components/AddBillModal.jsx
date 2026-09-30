import { useState } from "react";
import { X, Receipt, IndianRupee } from "lucide-react";
import { api } from "../services/api";

export default function AddBillModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    billName: "",
    amount: "",
    category: "",
    dueDate: new Date().toISOString().split("T")[0],
    status: "PENDING",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.billName.trim()) {
      setError("Bill name is required.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (!formData.dueDate) {
      setError("Due date is required.");
      return;
    }

    try {
      setLoading(true);

      const billData = {
        billName: formData.billName.trim(),
        amount: Number(formData.amount),
        category: formData.category.trim(),
        dueDate: formData.dueDate,
        status: formData.status,
        description: formData.description.trim(),
      };

      await api.addBill(billData);

      setFormData({
        billName: "",
        amount: "",
        category: "",
        dueDate: new Date().toISOString().split("T")[0],
        status: "PENDING",
        description: "",
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add bill.");
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
              <Receipt size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Add Bill
              </h2>
              <p className="text-sm text-slate-500">
                Add a new bill to track
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

          {/* Bill Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Bill Name
            </label>

            <input
              type="text"
              name="billName"
              value={formData.billName}
              onChange={handleChange}
              placeholder="Electricity Bill"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Amount
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
                placeholder="2500"
                min="0"
                step="0.01"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

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
              placeholder="Utilities"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Due Date + Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Monthly electricity bill"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
              {loading ? "Adding..." : "Add Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
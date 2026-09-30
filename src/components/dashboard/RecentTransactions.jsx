import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Receipt,
  Pencil,
  Trash2,
  Search,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function RecentTransactions({
  recent,
  onEdit,
  onDelete,
  deletingId,
}) {
  const [activeTab, setActiveTab] =
    useState("expenses");

  const [search, setSearch] =
    useState("");

  const expenses =
    recent?.expenses || [];

  const income =
    recent?.income || [];

  const savings =
    recent?.savings || [];

  const tabs = [
    {
      key: "expenses",
      label: "Expenses",
      shortLabel: "Expenses",
      items: expenses,
      color: "red",
    },
    {
      key: "income",
      label: "Income",
      shortLabel: "Income",
      items: income,
      color: "emerald",
    },
    {
      key: "savings",
      label: "Savings",
      shortLabel: "Savings",
      items: savings,
      color: "purple",
    },
  ];

  const activeItems =
    tabs.find(
      (tab) => tab.key === activeTab
    )?.items || [];

  const filteredItems = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return activeItems;
    }

    return activeItems.filter((item) => {
      const text = [
        item.description,
        item.category,
        item.source,
        item.type,
        item.title,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(value);
    });
  }, [activeItems, search]);

  const getTitle = (item) => {
    return (
      item.description ||
      item.title ||
      item.source ||
      item.category ||
      item.type ||
      "Transaction"
    );
  };

  const getSubtitle = (item) => {
    const category =
      item.category ||
      item.source ||
      item.type;

    const date = formatDate(
      item.expenseDate ||
        item.incomeDate ||
        item.savingDate ||
        item.date
    );

    if (category && date) {
      return `${category} • ${date}`;
    }

    return category || date || "Transaction";
  };

  const getTabCount = (tab) => {
    return tab.items.length;
  };

  const getTransactionIcon = (
    activeTab
  ) => {
    if (activeTab === "expenses") {
      return ArrowUpRight;
    }

    if (activeTab === "income") {
      return ArrowDownLeft;
    }

    return PiggyBank;
  };

  const getIconStyles = (activeTab) => {
    if (activeTab === "expenses") {
      return "bg-red-50 text-red-500";
    }

    if (activeTab === "income") {
      return "bg-emerald-50 text-emerald-600";
    }

    return "bg-purple-50 text-purple-600";
  };

  const getAmountStyles = (activeTab) => {
    if (activeTab === "expenses") {
      return "text-red-500";
    }

    if (activeTab === "income") {
      return "text-emerald-600";
    }

    return "text-purple-600";
  };

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-sm
      "
    >

      {/* =========================================
          HEADER
      ========================================= */}
      <div className="border-b border-slate-100">

        <div className="p-4 sm:p-6">

          {/* TITLE */}
          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">
              <div className="flex items-center gap-2.5">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Receipt size={18} />
                </div>

                <div>
                  <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                    Recent transactions
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                    Your latest financial activity
                  </p>
                </div>

              </div>
            </div>

            {/* TOTAL COUNT */}
            <div className="hidden shrink-0 rounded-xl bg-slate-50 px-3 py-2 text-center sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Total
              </p>

              <p className="mt-0.5 text-sm font-bold text-slate-700">
                {activeItems.length}
              </p>
            </div>

          </div>

          {/* =====================================
              TABS
          ===================================== */}
          <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">

            {tabs.map((tab) => {
              const active =
                activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSearch("");
                  }}
                  className={`
                    relative rounded-lg
                    px-2 py-2
                    text-xs font-semibold
                    transition-all duration-200
                    sm:px-3 sm:py-2.5
                    sm:text-sm

                    ${
                      active
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }
                  `}
                >
                  <span>
                    {tab.shortLabel}
                  </span>

                  <span
                    className={`
                      ml-1.5
                      rounded-full
                      px-1.5 py-0.5
                      text-[10px]
                      ${
                        active
                          ? "bg-slate-100 text-slate-600"
                          : "bg-slate-200/70 text-slate-400"
                      }
                    `}
                  >
                    {getTabCount(tab)}
                  </span>
                </button>
              );
            })}

          </div>

          {/* =====================================
              SEARCH
          ===================================== */}
          <div className="relative mt-3">

            <Search
              size={16}
              className="
                absolute left-3.5 top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder={`Search ${activeTab}...`}
              className="
                w-full
                rounded-xl
                border border-slate-200
                bg-slate-50
                py-2.5
                pl-10
                pr-10
                text-sm
                text-slate-700
                outline-none
                placeholder:text-slate-400
                transition-all
                focus:border-emerald-500
                focus:bg-white
                focus:ring-2
                focus:ring-emerald-100
              "
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="
                  absolute right-2.5 top-1/2
                  flex h-7 w-7
                  -translate-y-1/2
                  items-center justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-600
                "
              >
                <X size={15} />
              </button>
            )}

          </div>

        </div>
      </div>

      {/* =========================================
          TRANSACTION LIST
      ========================================= */}
      {filteredItems.length === 0 ? (
        <div className="px-5 py-12 text-center sm:px-6">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <Receipt
              size={22}
              className="text-slate-400"
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            {search
              ? "No matching transactions"
              : `No ${activeTab} yet`}
          </p>

          <p className="mt-1 max-w-xs mx-auto text-xs leading-5 text-slate-400">
            {search
              ? "Try searching with a different keyword."
              : `Your ${activeTab} will appear here once you add them.`}
          </p>

        </div>
      ) : (
        <div className="divide-y divide-slate-100">

          {filteredItems.map(
            (item, index) => {
              const isExpense =
                activeTab === "expenses";

              const isIncome =
                activeTab === "income";

              const Icon =
                getTransactionIcon(
                  activeTab
                );

              return (
                <div
                  key={
                    item.id ||
                    `${activeTab}-${index}`
                  }
                  className="
                    group
                    flex items-center gap-3
                    px-4 py-3.5
                    transition-colors
                    hover:bg-slate-50/70
                    sm:px-6 sm:py-4
                  "
                >

                  {/* =================================
                      ICON
                  ================================= */}
                  <div
                    className={`
                      flex h-10 w-10
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      sm:h-11 sm:w-11
                      ${getIconStyles(
                        activeTab
                      )}
                    `}
                  >
                    <Icon
                      size={18}
                      strokeWidth={2.2}
                    />
                  </div>

                  {/* =================================
                      DETAILS
                  ================================= */}
                  <div className="min-w-0 flex-1">

                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-slate-800
                      "
                      title={getTitle(item)}
                    >
                      {getTitle(item)}
                    </p>

                    <p className="
                      mt-1
                      truncate
                      text-[11px]
                      text-slate-400
                      sm:text-xs
                    ">
                      {getSubtitle(item)}
                    </p>

                  </div>

                  {/* =================================
                      AMOUNT
                  ================================= */}
                  <div className="shrink-0 text-right">

                    <p
                      className={`
                        text-sm
                        font-bold
                        ${getAmountStyles(
                          activeTab
                        )}
                      `}
                    >
                      {isExpense
                        ? "-"
                        : "+"}
                      {formatCurrency(
                        item.amount
                      )}
                    </p>

                  </div>

                  {/* =================================
                      EXPENSE ACTIONS
                  ================================= */}
                  {isExpense && (
                    <div
                      className="
                        flex shrink-0
                        gap-0.5
                        sm:gap-1
                      "
                    >

                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() =>
                          onEdit?.(item)
                        }
                        className="
                          flex h-8 w-8
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-400
                          transition-all
                          hover:bg-emerald-50
                          hover:text-emerald-600
                        "
                        title="Edit expense"
                        aria-label="Edit expense"
                      >
                        <Pencil size={14} />
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        disabled={
                          deletingId ===
                          item.id
                        }
                        onClick={() =>
                          onDelete?.(item)
                        }
                        className="
                          flex h-8 w-8
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-400
                          transition-all
                          hover:bg-red-50
                          hover:text-red-600
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                        title="Delete expense"
                        aria-label="Delete expense"
                      >
                        {deletingId ===
                        item.id ? (
                          <span
                            className="
                              h-4 w-4
                              animate-spin
                              rounded-full
                              border-2
                              border-slate-300
                              border-t-red-500
                            "
                          />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>

                    </div>
                  )}

                </div>
              );
            }
          )}

        </div>
      )}

    </section>
  );
}
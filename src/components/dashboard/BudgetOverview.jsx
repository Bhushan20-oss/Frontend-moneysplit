import {
  Wallet,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function BudgetOverview({
  budget,
}) {
  const totalBudget = Number(
    budget?.totalBudget || 0
  );

  const budgetRemaining = Number(
    budget?.budgetRemaining || 0
  );

  const used = Math.max(
    totalBudget - budgetRemaining,
    0
  );

  const percentage =
    totalBudget > 0
      ? Math.min(
          (used / totalBudget) * 100,
          100
        )
      : 0;

  const budgetUsed =
    budget?.budgetUsed || {};

  const categories = Object.entries(
    budgetUsed
  ).map(([name, data]) => ({
    name,
    budget: Number(data?.budget || 0),
    spent: Number(data?.spent || 0),
    remaining: Number(data?.remaining || 0),
  }));

  const getProgressColor = (value) => {
    if (value >= 100) {
      return "bg-red-500";
    }

    if (value >= 80) {
      return "bg-orange-500";
    }

    return "bg-emerald-500";
  };

  const getTextColor = (value) => {
    if (value >= 100) {
      return "text-red-500";
    }

    if (value >= 80) {
      return "text-orange-500";
    }

    return "text-emerald-600";
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
      <div className="border-b border-slate-100 p-5 sm:p-6">

        <div className="flex items-center justify-between gap-3">

          <div className="min-w-0">

            <div className="flex items-center gap-2.5">

              <div
                className="
                  flex h-10 w-10
                  shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-emerald-50
                  text-emerald-600
                "
              >
                <Wallet
                  size={19}
                  strokeWidth={2}
                />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Monthly budget
                </h2>

                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  Track your budget usage
                </p>
              </div>

            </div>

          </div>

          <div className="hidden shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:block">
            {categories.length}{" "}
            {categories.length === 1
              ? "category"
              : "categories"}
          </div>

        </div>

      </div>

      {/* =========================================
          TOTAL BUDGET
      ========================================= */}
      <div className="p-5 sm:p-6">

        <div
          className="
            rounded-2xl
            border border-slate-100
            bg-slate-50/70
            p-4
            sm:p-5
          "
        >

          {/* Amount */}
          <div className="flex items-end justify-between gap-4">

            <div className="min-w-0">

              <p className="text-xs font-medium text-slate-400">
                Budget used
              </p>

              <p className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {formatCurrency(used)}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                of {formatCurrency(totalBudget)}
              </p>

            </div>

            {/* Percentage */}
            <div className="shrink-0 text-right">

              <p
                className={`text-xl font-bold ${getTextColor(
                  percentage
                )}`}
              >
                {percentage.toFixed(0)}%
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                used
              </p>

            </div>

          </div>

          {/* Progress */}
          <div className="mt-4">

            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">

              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                  percentage
                )}`}
                style={{
                  width: `${percentage}%`,
                }}
              />

            </div>

          </div>

          {/* Remaining */}
          <div className="mt-3 flex items-center justify-between gap-3">

            <span className="text-xs text-slate-400">
              Remaining
            </span>

            <span
              className={`
                text-xs
                font-semibold
                ${
                  budgetRemaining < 0
                    ? "text-red-500"
                    : "text-slate-700"
                }
              `}
            >
              {formatCurrency(
                Math.max(
                  budgetRemaining,
                  0
                )
              )}
            </span>

          </div>

        </div>

      </div>

      {/* =========================================
          CATEGORY BUDGETS
      ========================================= */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Category budgets
            </h3>

            <p className="mt-0.5 text-xs text-slate-400">
              Spending by category
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 sm:hidden">
            {categories.length}
          </span>

        </div>

        {/* EMPTY */}
        {categories.length === 0 ? (
          <div
            className="
              rounded-2xl
              border border-dashed
              border-slate-200
              bg-slate-50/70
              px-5 py-8
              text-center
            "
          >

            <div
              className="
                mx-auto
                flex h-12 w-12
                items-center justify-center
                rounded-full
                bg-white
                shadow-sm
              "
            >
              <CheckCircle2
                size={23}
                className="text-slate-300"
              />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-600">
              No category budgets
            </p>

            <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-400">
              Set category budgets to track your spending progress.
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {categories.map((category) => {

              const percent =
                category.budget > 0
                  ? Math.min(
                      (category.spent /
                        category.budget) *
                        100,
                      100
                    )
                  : 0;

              const overBudget =
                category.remaining < 0;

              return (
                <div
                  key={category.name}
                  className="
                    rounded-xl
                    border border-slate-100
                    bg-white
                    p-3.5
                    transition
                    hover:border-slate-200
                    hover:shadow-sm
                    sm:p-4
                  "
                >

                  {/* Category header */}
                  <div className="flex items-center justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-2">

                      <span
                        className={`
                          flex h-7 w-7
                          shrink-0
                          items-center justify-center
                          rounded-lg
                          ${
                            overBudget
                              ? "bg-red-50 text-red-500"
                              : percent >= 80
                              ? "bg-orange-50 text-orange-500"
                              : "bg-emerald-50 text-emerald-600"
                          }
                        `}
                      >
                        <ArrowUpRight
                          size={14}
                        />
                      </span>

                      <p className="truncate text-sm font-semibold text-slate-700">
                        {category.name}
                      </p>

                    </div>

                    <p className="shrink-0 text-xs font-semibold text-slate-600">
                      {formatCurrency(
                        category.spent
                      )}
                      <span className="font-normal text-slate-400">
                        {" "}
                        /{" "}
                        {formatCurrency(
                          category.budget
                        )}
                      </span>
                    </p>

                  </div>

                  {/* Progress */}
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                        percent
                      )}`}
                      style={{
                        width: `${percent}%`,
                      }}
                    />

                  </div>

                  {/* Bottom information */}
                  <div className="mt-2 flex items-center justify-between gap-3">

                    <span className="text-[11px] font-medium text-slate-400">
                      {percent.toFixed(0)}% used
                    </span>

                    {overBudget ? (
                      <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-red-500">
                        <AlertTriangle
                          size={11}
                        />
                        Over budget
                      </span>
                    ) : (
                      <span className="truncate text-[11px] font-medium text-slate-400">
                        {formatCurrency(
                          category.remaining
                        )}{" "}
                        left
                      </span>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </section>
  );
}
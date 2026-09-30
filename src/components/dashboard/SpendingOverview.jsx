import DonutChart from "./DonutChart";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#64748b",
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function SpendingOverview({
  expenseByCategory,
}) {
  const data = Object.entries(expenseByCategory || {})
    .map(([name, amount]) => ({
      name,
      amount: Number(amount || 0),
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const total = data.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <section className="mb-7">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          Spending overview
        </h2>

        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
          See where your money is going
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* TOP SUMMARY */}
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Total expenses
              </p>

              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {formatCurrency(total)}
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-red-50 px-3 py-2 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
                Categories
              </p>

              <p className="mt-0.5 text-lg font-bold text-red-500">
                {data.length}
              </p>
            </div>

          </div>
        </div>

        {/* CONTENT */}
        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-2 lg:gap-8">

          {/* DONUT CHART */}
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-slate-50/70 p-3 sm:min-h-[320px]">
            {data.length === 0 ? (
              <div className="px-5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                  <span className="text-xl">₹</span>
                </div>

                <p className="mt-3 text-sm font-medium text-slate-600">
                  No spending yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Your expense breakdown will appear here.
                </p>
              </div>
            ) : (
              <div className="w-full">
                <DonutChart data={data} />
              </div>
            )}
          </div>

          {/* CATEGORY BREAKDOWN */}
          <div className="flex flex-col justify-center">

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  By category
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  Expense distribution
                </p>
              </div>
            </div>

            {data.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-sm font-medium text-slate-500">
                  No expense data available
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                {data.map((item, index) => {
                  const percentage =
                    total > 0
                      ? (item.amount / total) * 100
                      : 0;

                  const color =
                    COLORS[index % COLORS.length];

                  return (
                    <div
                      key={item.name}
                      className="group"
                    >
                      {/* CATEGORY ROW */}
                      <div className="flex items-center gap-3">

                        <span
                          className="h-3 w-3 shrink-0 rounded-full ring-4 ring-slate-50"
                          style={{
                            backgroundColor: color,
                          }}
                        />

                        <div className="min-w-0 flex-1">

                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-medium text-slate-700">
                              {item.name}
                            </p>

                            <p className="shrink-0 text-sm font-semibold text-slate-900">
                              {formatCurrency(item.amount)}
                            </p>
                          </div>

                          {/* PROGRESS */}
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>

                          {/* PERCENTAGE */}
                          <div className="mt-1 flex justify-end">
                            <span className="text-[11px] font-medium text-slate-400">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
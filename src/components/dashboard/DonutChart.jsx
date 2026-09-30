import { useMemo } from "react";

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

export default function DonutChart({ data = [] }) {
  const total = useMemo(() => {
    return data.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );
  }, [data]);

  const segments = useMemo(() => {
    if (!total) return [];

    let currentAngle = 0;

    return data.map((item, index) => {
      const amount = Number(item.amount || 0);

      const percentage =
        (amount / total) * 100;

      const angle =
        (amount / total) * 360;

      const startAngle = currentAngle;

      currentAngle += angle;

      return {
        ...item,
        amount,
        percentage,
        startAngle,
        endAngle: currentAngle,
        color:
          COLORS[index % COLORS.length],
      };
    });
  }, [data, total]);

  /* =========================================
     EMPTY STATE
  ========================================= */
  if (!data.length || total === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <div className="text-center">

          <div className="relative mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full border-[20px] border-slate-100">

            <div className="absolute inset-0 rounded-full border border-dashed border-slate-200" />

            <span className="text-xs font-semibold text-slate-400">
              No data
            </span>

          </div>

          <p className="text-sm font-semibold text-slate-600">
            No expenses recorded
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Your spending breakdown will appear here.
          </p>

        </div>
      </div>
    );
  }

  /* =========================================
     DONUT GRADIENT
  ========================================= */
  const gradient = segments
    .map(
      (segment) =>
        `${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg`
    )
    .join(", ");

  return (
    <div className="flex min-h-[280px] items-center justify-center">

      <div className="relative">

        {/* OUTER RING */}
        <div
          className="
            relative
            h-52 w-52
            rounded-full
            p-1
            shadow-sm
            sm:h-60 sm:w-60
          "
          style={{
            background: `conic-gradient(${gradient})`,
          }}
        >

          {/* INNER DONUT */}
          <div
            className="
              absolute inset-3
              flex flex-col
              items-center justify-center
              rounded-full
              bg-white
              shadow-inner
              sm:inset-4
            "
          >

            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Total spent
            </span>

            <span className="mt-1.5 max-w-[150px] truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {formatCurrency(total)}
            </span>

            <span className="mt-1 text-[10px] text-slate-400">
              {segments.length}{" "}
              {segments.length === 1
                ? "category"
                : "categories"}
            </span>

          </div>
        </div>

        {/* DECORATIVE DOT */}
        <div className="absolute -right-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-slate-200 shadow-sm" />

      </div>
    </div>
  );
}
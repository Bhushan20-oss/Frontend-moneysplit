import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Wallet,
} from "lucide-react";

function formatCurrency(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  valueClass,
}) {
  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl border border-slate-200
        bg-white
        p-4 sm:p-5
        shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-slate-50 opacity-70 transition-transform duration-300 group-hover:scale-125" />

      <div className="relative">

        {/* TOP */}
        <div className="flex items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-2.5">

            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
            >
              <Icon
                size={18}
                strokeWidth={2.2}
              />
            </div>

            <p className="truncate text-xs font-semibold text-slate-500 sm:text-sm">
              {title}
            </p>

          </div>
        </div>

        {/* VALUE */}
        <p
          className={`
            mt-4
            truncate
            text-[23px]
            font-bold
            tracking-tight
            sm:text-2xl
            ${valueClass}
          `}
          title={value}
        >
          {value}
        </p>

        {/* SUBTITLE */}
        <p className="mt-1.5 truncate text-[11px] text-slate-400 sm:text-xs">
          {subtitle}
        </p>

      </div>
    </div>
  );
}

export default function SummaryCards({ summary }) {
  const income = Number(
    summary?.totalIncome || 0
  );

  const expenses = Number(
    summary?.totalExpenses || 0
  );

  const savings = Number(
    summary?.totalSavings || 0
  );

  // Backend field is remainingMoney
  const remaining =
    summary?.remainingMoney !== undefined
      ? Number(summary.remainingMoney)
      : income - expenses - savings;

  return (
    <section className="mb-7">

      {/* SECTION HEADER */}
      <div className="mb-4 flex items-end justify-between gap-3">

        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Financial summary
          </h2>

          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Your money at a glance
          </p>
        </div>

      </div>

      {/* CARDS */}
      <div
        className="
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-2
          sm:gap-4
          xl:grid-cols-4
        "
      >

        {/* INCOME */}
        <SummaryCard
          title="Income"
          value={formatCurrency(income)}
          subtitle="Money received"
          icon={ArrowDownLeft}
          iconClass="bg-emerald-50 text-emerald-600"
          valueClass="text-emerald-600"
        />

        {/* EXPENSES */}
        <SummaryCard
          title="Expenses"
          value={formatCurrency(expenses)}
          subtitle="Money spent"
          icon={ArrowUpRight}
          iconClass="bg-red-50 text-red-500"
          valueClass="text-red-500"
        />

        {/* SAVINGS */}
        <SummaryCard
          title="Savings"
          value={formatCurrency(savings)}
          subtitle="Money saved"
          icon={PiggyBank}
          iconClass="bg-blue-50 text-blue-500"
          valueClass="text-blue-600"
        />

        {/* REMAINING */}
        <SummaryCard
          title="Remaining"
          value={formatCurrency(remaining)}
          subtitle="Available balance"
          icon={Wallet}
          iconClass={
            remaining >= 0
              ? "bg-violet-50 text-violet-600"
              : "bg-orange-50 text-orange-500"
          }
          valueClass={
            remaining >= 0
              ? "text-violet-600"
              : "text-orange-500"
          }
        />

      </div>
    </section>
  );
}
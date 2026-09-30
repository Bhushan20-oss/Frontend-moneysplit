import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Receipt,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
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

const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Reports() {
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  );

  const [report, setReport] = useState(null);
  const [comparison, setComparison] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [monthlyResponse, comparisonResponse] =
        await Promise.all([
          api.getMonthlyReport(
            selectedMonth,
            selectedYear
          ),
          api.getComparisonReport(
            selectedMonth,
            selectedYear
          ),
        ]);

      setReport(
        monthlyResponse?.report ||
          monthlyResponse?.data ||
          null
      );

      setComparison(
        comparisonResponse?.comparison ||
          comparisonResponse?.data ||
          null
      );
    } catch (err) {
      setError(
        err.message || "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedMonth, selectedYear]);

  const summary = report?.summary || {};
  const budget = report?.budget || {};
  const bills = report?.bills || {};
  const breakdown = report?.breakdown || {};
  const transactions = report?.transactions || {};

  const expenseByCategory =
    breakdown?.expenseByCategory || {};

  const incomeBySource =
    breakdown?.incomeBySource || {};

  const savingsByType =
    breakdown?.savingsByType || {};

  const budgetDetails =
    budget?.details || [];

  const incomes =
    transactions?.incomes || [];

  const expenses =
    transactions?.expenses || [];

  const savings =
    transactions?.savings || [];

  const reportTotals = useMemo(() => {
    return {
      income: Number(summary.totalIncome) || 0,
      expenses: Number(summary.totalExpenses) || 0,
      savings: Number(summary.totalSavings) || 0,
      remaining: Number(summary.remainingMoney) || 0,
    };
  }, [summary]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  const formatNumber = (amount) => {
    return new Intl.NumberFormat("en-IN").format(
      Number(amount) || 0
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getComparisonValue = (type) => {
    return (
      comparison?.comparison?.[type] || {
        current: 0,
        previous: 0,
        difference: 0,
        percentageChange: 0,
      }
    );
  };

  const getPercentageWidth = (
    value,
    values
  ) => {
    const max = Math.max(...values, 1);

    return Math.min(
      (Number(value) / max) * 100,
      100
    );
  };

  const getChangeColor = (
    type,
    difference
  ) => {
    const value = Number(difference) || 0;

    if (type === "expenses") {
      return value > 0
        ? "text-red-600"
        : value < 0
        ? "text-emerald-600"
        : "text-slate-500";
    }

    return value > 0
      ? "text-emerald-600"
      : value < 0
      ? "text-red-600"
      : "text-slate-500";
  };

  const getChangeIcon = (difference) => {
    const value = Number(difference) || 0;

    if (value > 0) {
      return <ArrowUpRight size={15} />;
    }

    if (value < 0) {
      return <ArrowDownRight size={15} />;
    }

    return null;
  };

  const renderTransactionAmount = (
    type,
    amount
  ) => {
    const numericAmount =
      Number(amount) || 0;

    if (type === "income") {
      return (
        <span className="font-semibold text-emerald-600">
          +{formatCurrency(numericAmount)}
        </span>
      );
    }

    if (type === "saving") {
      return (
        <span className="font-semibold text-blue-600">
          {formatCurrency(numericAmount)}
        </span>
      );
    }

    return (
      <span className="font-semibold text-red-600">
        -{formatCurrency(numericAmount)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64">
        <DashboardHeader />

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                  <BarChart3 size={24} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Financial Reports
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Understand where your money went this month.
                  </p>
                </div>
              </div>
            </div>

            {/* Month / Year */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <CalendarDays
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={selectedMonth}
                  onChange={(e) =>
                    setSelectedMonth(
                      Number(e.target.value)
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {months.map((month) => (
                    <option
                      key={month.value}
                      value={month.value}
                    >
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    Number(e.target.value)
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                {[2025, 2026, 2027, 2028, 2029].map(
                  (year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <span>{error}</span>

              <button
                onClick={fetchReports}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

              <p className="mt-4 text-sm text-slate-500">
                Generating your report...
              </p>
            </div>
          ) : !report ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <BarChart3
                size={40}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No report available
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                There is no report data for the selected month.
              </p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* Income */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Total Income
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-slate-900">
                        {formatCurrency(
                          reportTotals.income
                        )}
                      </h2>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                      <TrendingUp size={21} />
                    </div>
                  </div>

                  <Comparison
                    data={getComparisonValue("income")}
                    color={getChangeColor(
                      "income",
                      getComparisonValue("income")
                        .difference
                    )}
                    icon={getChangeIcon(
                      getComparisonValue("income")
                        .difference
                    )}
                    formatCurrency={formatCurrency}
                  />
                </div>

                {/* Expenses */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Total Expenses
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-slate-900">
                        {formatCurrency(
                          reportTotals.expenses
                        )}
                      </h2>
                    </div>

                    <div className="rounded-xl bg-red-50 p-3 text-red-600">
                      <TrendingDown size={21} />
                    </div>
                  </div>

                  <Comparison
                    data={getComparisonValue("expenses")}
                    color={getChangeColor(
                      "expenses",
                      getComparisonValue("expenses")
                        .difference
                    )}
                    icon={getChangeIcon(
                      getComparisonValue("expenses")
                        .difference
                    )}
                    formatCurrency={formatCurrency}
                  />
                </div>

                {/* Savings */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Total Savings
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-slate-900">
                        {formatCurrency(
                          reportTotals.savings
                        )}
                      </h2>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                      <PiggyBank size={21} />
                    </div>
                  </div>

                  <Comparison
                    data={getComparisonValue("savings")}
                    color={getChangeColor(
                      "savings",
                      getComparisonValue("savings")
                        .difference
                    )}
                    icon={getChangeIcon(
                      getComparisonValue("savings")
                        .difference
                    )}
                    formatCurrency={formatCurrency}
                  />
                </div>

                {/* Remaining */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Remaining Money
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-slate-900">
                        {formatCurrency(
                          reportTotals.remaining
                        )}
                      </h2>
                    </div>

                    <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                      <Wallet size={21} />
                    </div>
                  </div>

                  <Comparison
                    data={getComparisonValue(
                      "remainingMoney"
                    )}
                    color={getChangeColor(
                      "remainingMoney",
                      getComparisonValue(
                        "remainingMoney"
                      ).difference
                    )}
                    icon={getChangeIcon(
                      getComparisonValue(
                        "remainingMoney"
                      ).difference
                    )}
                    formatCurrency={formatCurrency}
                  />
                </div>
              </div>

              {/* Rates */}
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Savings Rate
                      </p>

                      <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                        {Number(
                          summary.savingsRate || 0
                        ).toFixed(1)}
                        %
                      </h3>
                    </div>

                    <PiggyBank
                      size={28}
                      className="text-emerald-500"
                    />
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${Math.min(
                          Number(
                            summary.savingsRate || 0
                          ),
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Percentage of income saved
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Expense Rate
                      </p>

                      <h3 className="mt-2 text-3xl font-bold text-red-600">
                        {Number(
                          summary.expenseRate || 0
                        ).toFixed(1)}
                        %
                      </h3>
                    </div>

                    <TrendingDown
                      size={28}
                      className="text-red-500"
                    />
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{
                        width: `${Math.min(
                          Number(
                            summary.expenseRate || 0
                          ),
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Percentage of income spent
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
                {/* Expenses */}
                <BreakdownCard
                  title="Expenses by Category"
                  icon={
                    <TrendingDown
                      size={19}
                    />
                  }
                  iconClass="bg-red-50 text-red-600"
                  data={expenseByCategory}
                  formatCurrency={formatCurrency}
                  getPercentageWidth={
                    getPercentageWidth
                  }
                  emptyText="No expenses recorded."
                />

                {/* Income */}
                <BreakdownCard
                  title="Income by Source"
                  icon={
                    <TrendingUp
                      size={19}
                    />
                  }
                  iconClass="bg-emerald-50 text-emerald-600"
                  data={incomeBySource}
                  formatCurrency={formatCurrency}
                  getPercentageWidth={
                    getPercentageWidth
                  }
                  emptyText="No income recorded."
                />

                {/* Savings */}
                <BreakdownCard
                  title="Savings by Type"
                  icon={
                    <PiggyBank
                      size={19}
                    />
                  }
                  iconClass="bg-blue-50 text-blue-600"
                  data={savingsByType}
                  formatCurrency={formatCurrency}
                  getPercentageWidth={
                    getPercentageWidth
                  }
                  emptyText="No savings recorded."
                />

                {/* Budget */}
                <BudgetReportCard
                  budget={budget}
                  budgetDetails={budgetDetails}
                  formatCurrency={formatCurrency}
                />
              </div>

              {/* Bills */}
              <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                    <Receipt size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Bills Summary
                    </h2>

                    <p className="text-sm text-slate-500">
                      Bill status for{" "}
                      {monthNames[selectedMonth]}{" "}
                      {selectedYear}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <BillStat
                    label="Total Bills"
                    count={bills.totalBills}
                    amount={
                      Number(
                        bills?.paid?.amount || 0
                      ) +
                      Number(
                        bills?.pending?.amount || 0
                      ) +
                      Number(
                        bills?.overdue?.amount || 0
                      )
                    }
                    color="slate"
                    formatCurrency={
                      formatCurrency
                    }
                  />

                  <BillStat
                    label="Paid"
                    count={bills?.paid?.count}
                    amount={bills?.paid?.amount}
                    color="emerald"
                    formatCurrency={
                      formatCurrency
                    }
                  />

                  <BillStat
                    label="Pending"
                    count={bills?.pending?.count}
                    amount={
                      bills?.pending?.amount
                    }
                    color="amber"
                    formatCurrency={
                      formatCurrency
                    }
                  />

                  <BillStat
                    label="Overdue"
                    count={bills?.overdue?.count}
                    amount={
                      bills?.overdue?.amount
                    }
                    color="red"
                    formatCurrency={
                      formatCurrency
                    }
                  />
                </div>
              </div>

              {/* Transactions */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600">
                      <Receipt size={20} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Monthly Transactions
                      </h2>

                      <p className="text-sm text-slate-500">
                        Transactions recorded during the selected month.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {[
                    ...incomes.map((item) => ({
                      ...item,
                      transactionType:
                        "income",
                    })),

                    ...expenses.map((item) => ({
                      ...item,
                      transactionType:
                        "expense",
                    })),

                    ...savings.map((item) => ({
                      ...item,
                      transactionType:
                        "saving",
                    })),
                  ]
                    .sort((a, b) => {
                      const dateA =
                        new Date(
                          a.incomeDate ||
                            a.expenseDate ||
                            a.savingDate ||
                            a.createdAt ||
                            0
                        ).getTime();

                      const dateB =
                        new Date(
                          b.incomeDate ||
                            b.expenseDate ||
                            b.savingDate ||
                            b.createdAt ||
                            0
                        ).getTime();

                      return dateB - dateA;
                    })
                    .slice(0, 15)
                    .map((item, index) => {
                      const date =
                        item.incomeDate ||
                        item.expenseDate ||
                        item.savingDate ||
                        item.createdAt;

                      const title =
                        item.source ||
                        item.category ||
                        item.savingType ||
                        "Transaction";

                      const description =
                        item.description;

                      return (
                        <div
                          key={`${item.transactionType}-${item.id || index}`}
                          className="flex items-center justify-between gap-4 p-5"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className={`rounded-xl p-2.5 ${
                                item.transactionType ===
                                "income"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : item.transactionType ===
                                    "saving"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {item.transactionType ===
                              "income" ? (
                                <TrendingUp
                                  size={18}
                                />
                              ) : item.transactionType ===
                                "saving" ? (
                                <PiggyBank
                                  size={18}
                                />
                              ) : (
                                <TrendingDown
                                  size={18}
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-900">
                                {title}
                              </p>

                              <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
                                <span>
                                  {formatDate(
                                    date
                                  )}
                                </span>

                                {description && (
                                  <>
                                    <span>
                                      •
                                    </span>

                                    <span className="truncate">
                                      {
                                        description
                                      }
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {renderTransactionAmount(
                              item.transactionType,
                              item.amount
                            )}
                          </div>
                        </div>
                      );
                    })}

                  {incomes.length === 0 &&
                    expenses.length === 0 &&
                    savings.length === 0 && (
                      <div className="p-10 text-center">
                        <Receipt
                          size={34}
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm text-slate-500">
                          No transactions recorded for this month.
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* ============================= */
/* Comparison Component */
/* ============================= */

function Comparison({
  data,
  color,
  icon,
  formatCurrency,
}) {
  if (!data) return null;

  return (
    <div className="mt-4 flex items-center gap-1.5 text-xs">
      <span className={color}>
        {icon}
      </span>

      <span className={color}>
        {formatCurrency(
          Math.abs(Number(data.difference) || 0)
        )}
      </span>

      <span className="text-slate-400">
        vs previous month
      </span>
    </div>
  );
}

/* ============================= */
/* Breakdown Card */
/* ============================= */

function BreakdownCard({
  title,
  icon,
  iconClass,
  data,
  formatCurrency,
  getPercentageWidth,
  emptyText,
}) {
  const entries = Object.entries(data || {});

  const values = entries.map(([, value]) =>
    Number(value) || 0
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div
          className={`rounded-xl p-2.5 ${iconClass}`}
        >
          {icon}
        </div>

        <h2 className="font-semibold text-slate-900">
          {title}
        </h2>
      </div>

      {entries.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-400">
            {emptyText}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {entries
            .sort(
              ([, a], [, b]) =>
                Number(b) - Number(a)
            )
            .map(([name, value]) => {
              const numericValue =
                Number(value) || 0;

              return (
                <div key={name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium text-slate-700">
                      {name}
                    </span>

                    <span className="shrink-0 text-sm font-semibold text-slate-900">
                      {formatCurrency(
                        numericValue
                      )}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${getPercentageWidth(
                          numericValue,
                          values
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

/* ============================= */
/* Budget Card */
/* ============================= */

function BudgetReportCard({
  budget,
  budgetDetails,
  formatCurrency,
}) {
  const totalBudget =
    Number(budget?.totalBudget) || 0;

  const totalSpent =
    Number(budget?.totalSpent) || 0;

  const remaining =
    Number(budget?.remaining) || 0;

  const percentage =
    totalBudget > 0
      ? Math.min(
          (totalSpent / totalBudget) * 100,
          100
        )
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
          <Wallet size={19} />
        </div>

        <h2 className="font-semibold text-slate-900">
          Budget Overview
        </h2>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-slate-400">
            Budget
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatCurrency(totalBudget)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Spent
          </p>

          <p className="mt-1 text-sm font-semibold text-red-600">
            {formatCurrency(totalSpent)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Remaining
          </p>

          <p className="mt-1 text-sm font-semibold text-emerald-600">
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-slate-500">
            Budget used
          </span>

          <span className="font-medium text-slate-700">
            {percentage.toFixed(0)}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${
              percentage >= 100
                ? "bg-red-500"
                : "bg-emerald-500"
            }`}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

      {budgetDetails.length > 0 ? (
        <div className="space-y-4">
          {budgetDetails.map((item) => (
            <div key={item.category}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  {item.category}
                </span>

                <span className="text-xs font-medium text-slate-500">
                  {Number(
                    item.percentageUsed || 0
                  ).toFixed(0)}
                  %
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${
                    Number(
                      item.percentageUsed || 0
                    ) >= 100
                      ? "bg-red-500"
                      : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      Number(
                        item.percentageUsed || 0
                      ),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">
          No category budgets for this month.
        </p>
      )}
    </div>
  );
}

/* ============================= */
/* Bills */
/* ============================= */

function BillStat({
  label,
  count,
  amount,
  color,
  formatCurrency,
}) {
  const colorClasses = {
    slate: "bg-slate-50 text-slate-600",
    emerald:
      "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <span
          className={`rounded-lg px-2 py-1 text-xs font-semibold ${colorClasses[color]}`}
        >
          {count || 0}
        </span>
      </div>

      <p className="mt-3 text-lg font-bold text-slate-900">
        {formatCurrency(amount)}
      </p>
    </div>
  );
}
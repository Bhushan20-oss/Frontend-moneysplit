import {
  CreditCard,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Bell,
  ArrowRight,
} from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function BillStatus({
  label,
  count,
  amount,
  icon: Icon,
  iconClass,
}) {
  return (
    <div
      className="
        flex items-center
        justify-between
        gap-3
        rounded-xl
        border border-slate-100
        bg-slate-50/70
        p-3.5
        transition
        hover:border-slate-200
        hover:bg-slate-50
      "
    >
      <div className="flex min-w-0 items-center gap-3">

        <div
          className={`
            flex h-10 w-10
            shrink-0
            items-center justify-center
            rounded-xl
            ${iconClass}
          `}
        >
          <Icon size={17} />
        </div>

        <div className="min-w-0">

          <p className="text-sm font-semibold text-slate-700">
            {label}
          </p>

          <p className="mt-0.5 text-[11px] text-slate-400">
            {count} bill
            {count === 1 ? "" : "s"}
          </p>

        </div>
      </div>

      <p className="shrink-0 text-sm font-bold text-slate-800">
        {formatCurrency(amount)}
      </p>

    </div>
  );
}

export default function BillsOverview({
  bills,
  upcomingBills,
}) {
  const paidCount = Number(
    bills?.paid?.count || 0
  );

  const pendingCount = Number(
    bills?.pending?.count || 0
  );

  const overdueCount = Number(
    bills?.overdue?.count || 0
  );

  const totalBills = Number(
    bills?.totalBills || 0
  );

  const upcoming =
    upcomingBills || [];

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
      <div
        className="
          border-b border-slate-100
          p-5
          sm:p-6
        "
      >

        <div className="flex items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-2.5">

            <div
              className="
                flex h-10 w-10
                shrink-0
                items-center justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
              "
            >
              <CreditCard
                size={19}
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">

              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                Bills
              </h2>

              <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                Monthly bill status
              </p>

            </div>

          </div>

          {totalBills > 0 && (
            <span
              className="
                shrink-0
                rounded-full
                bg-slate-100
                px-2.5 py-1
                text-[10px]
                font-semibold
                text-slate-500
              "
            >
              {totalBills}{" "}
              {totalBills === 1
                ? "bill"
                : "bills"}
            </span>
          )}

        </div>

      </div>

      {/* =========================================
          STATUS CARDS
      ========================================= */}
      <div className="p-5 sm:p-6">

        <div className="space-y-2.5">

          <BillStatus
            label="Paid"
            count={paidCount}
            amount={
              bills?.paid?.amount || 0
            }
            icon={CheckCircle2}
            iconClass="
              bg-emerald-50
              text-emerald-600
            "
          />

          <BillStatus
            label="Pending"
            count={pendingCount}
            amount={
              bills?.pending?.amount || 0
            }
            icon={Clock3}
            iconClass="
              bg-orange-50
              text-orange-600
            "
          />

          <BillStatus
            label="Overdue"
            count={overdueCount}
            amount={
              bills?.overdue?.amount || 0
            }
            icon={AlertCircle}
            iconClass="
              bg-red-50
              text-red-600
            "
          />

        </div>

      </div>

      {/* =========================================
          UPCOMING BILLS
      ========================================= */}
      <div
        className="
          border-t border-slate-100
          px-5
          pb-5
          pt-5
          sm:px-6
          sm:pb-6
        "
      >

        {/* Section header */}
        <div className="flex items-center justify-between gap-3">

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h3 className="text-sm font-bold text-slate-800">
                Upcoming bills
              </h3>

              <Bell
                size={14}
                className="text-slate-400"
              />

            </div>

            <p className="mt-0.5 text-xs text-slate-400">
              Bills requiring attention
            </p>

          </div>

          {upcoming.length > 0 && (
            <span className="shrink-0 text-[10px] font-semibold text-slate-400">
              Next {Math.min(upcoming.length, 5)}
            </span>
          )}

        </div>

        {/* =====================================
            EMPTY STATE
        ===================================== */}
        {!upcoming.length ? (
          <div
            className="
              mt-4
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
                className="text-emerald-400"
              />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-600">
              No upcoming bills
            </p>

            <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-400">
              You're all caught up for now.
            </p>

          </div>
        ) : (

          /* ===================================
             UPCOMING LIST
          =================================== */
          <div className="mt-4 space-y-2.5">

            {upcoming
              .slice(0, 5)
              .map((bill, index) => {

                const title =
                  bill.billName ||
                  bill.title ||
                  bill.name ||
                  bill.description ||
                  "Bill";

                const date =
                  bill.dueDate ||
                  bill.billDate;

                let formattedDate = "";

                if (date) {
                  const parsedDate =
                    new Date(date);

                  if (
                    !Number.isNaN(
                      parsedDate.getTime()
                    )
                  ) {
                    formattedDate =
                      parsedDate.toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                        }
                      );
                  }
                }

                return (
                  <div
                    key={
                      bill.id ||
                      `bill-${index}`
                    }
                    className="
                      flex items-center
                      justify-between
                      gap-3
                      rounded-xl
                      border border-slate-100
                      bg-white
                      p-3.5
                      transition
                      hover:border-slate-200
                      hover:shadow-sm
                    "
                  >

                    {/* BILL INFO */}
                    <div className="flex min-w-0 items-center gap-3">

                      <div
                        className="
                          flex h-9 w-9
                          shrink-0
                          items-center justify-center
                          rounded-lg
                          bg-blue-50
                          text-blue-500
                        "
                      >
                        <CreditCard
                          size={15}
                        />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-slate-700">
                          {title}
                        </p>

                        {formattedDate ? (
                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Due {formattedDate}
                          </p>
                        ) : (
                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Upcoming payment
                          </p>
                        )}

                      </div>

                    </div>

                    {/* AMOUNT */}
                    <div className="flex shrink-0 items-center gap-1.5">

                      <p className="text-sm font-bold text-slate-800">
                        {formatCurrency(
                          bill.amount
                        )}
                      </p>

                      <ArrowRight
                        size={14}
                        className="hidden text-slate-300 sm:block"
                      />

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
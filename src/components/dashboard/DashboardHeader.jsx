import {
  CalendarDays,
  ChevronDown,
  RefreshCw,
  Wallet,
  LogOut,
  X,
  Menu,
  LayoutDashboard,
  Receipt,
  TrendingUp,
  PiggyBank,
  CreditCard,
  BarChart3,
  User,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

export default function DashboardHeader({
  month,
  year,
  onChangeMonth,
  onRefresh,
  refreshing,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const months = Array.from(
    { length: 12 },
    (_, index) => ({
      value: index + 1,
      label: new Date(
        year,
        index,
        1
      ).toLocaleDateString("en-IN", {
        month: "short",
      }),
    })
  );

  const years = [
    year - 2,
    year - 1,
    year,
    year + 1,
    year + 2,
  ];

  const monthName = new Date(
    year,
    month - 1,
    1
  ).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const shortMonthName = new Date(
    year,
    month - 1,
    1
  ).toLocaleDateString("en-IN", {
    month: "short",
  });

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "Expenses",
      icon: Receipt,
      path: "/expenses",
    },
    {
      label: "Income",
      icon: TrendingUp,
      path: "/income",
    },
    {
      label: "Savings",
      icon: PiggyBank,
      path: "/savings",
    },
    {
      label: "Bills",
      icon: CreditCard,
      path: "/bills",
    },
    {
      label: "Budgets",
      icon: Wallet,
      path: "/budgets",
    },
    {
      label: "Reports",
      icon: BarChart3,
      path: "/reports",
    },
    {
      label: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  const handleNavigation = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* =========================================
          HEADER
      ========================================= */}
      <header
        className="
          sticky top-0 z-30
          border-b border-slate-200
          bg-white/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            flex min-h-[68px]
            items-center justify-between
            gap-3
            px-4
            sm:min-h-[72px]
            sm:px-6
            lg:min-h-20
            lg:px-8
          "
        >

          {/* =====================================
              LEFT
          ===================================== */}
          <div className="flex min-w-0 items-center gap-3">

            {/* HAMBURGER - MOBILE */}
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(true)
              }
              className="
                flex h-9 w-9
                shrink-0
                items-center justify-center
                rounded-xl
                border border-slate-200
                bg-white
                text-slate-600
                shadow-sm
                transition-all
                hover:bg-slate-50
                hover:text-slate-900
                lg:hidden
              "
              aria-label="Open menu"
            >
              <Menu size={19} />
            </button>

            {/* Mobile logo */}
            <div
              className="
                hidden h-9 w-9
                shrink-0
                items-center justify-center
                rounded-xl
                bg-emerald-500
                text-white
                shadow-sm
                shadow-emerald-500/20
                sm:flex
                lg:hidden
              "
            >
              <Wallet
                size={18}
                strokeWidth={2.2}
              />
            </div>

            {/* TITLE */}
            <div className="min-w-0">

              <p
                className="
                  hidden
                  text-[11px]
                  font-medium
                  text-slate-400
                  sm:block
                "
              >
                Financial overview
              </p>

              <h2
                className="
                  truncate
                  text-sm
                  font-bold
                  tracking-tight
                  text-slate-900
                  sm:mt-0.5
                  sm:text-base
                "
              >
                <span className="sm:hidden">
                  {shortMonthName} {year}
                </span>

                <span className="hidden sm:inline">
                  {monthName}
                </span>
              </h2>

            </div>
          </div>

          {/* =====================================
              RIGHT
          ===================================== */}
          <div className="flex shrink-0 items-center gap-2">

            {/* MONTH SELECTOR */}
            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setOpen((value) => !value)
                }
                className="
                  flex h-10
                  items-center
                  gap-2
                  rounded-xl
                  border border-slate-200
                  bg-white
                  px-3
                  text-xs
                  font-semibold
                  text-slate-700
                  shadow-sm
                  outline-none
                  transition-all
                  hover:border-slate-300
                  hover:bg-slate-50
                  focus:ring-2
                  focus:ring-emerald-100
                  sm:px-3.5
                  sm:text-sm
                "
              >
                <CalendarDays
                  size={16}
                  className="shrink-0 text-emerald-500"
                />

                <span className="hidden sm:block">
                  {monthName}
                </span>

                <span className="sm:hidden">
                  {shortMonthName} {year}
                </span>

                <ChevronDown
                  size={15}
                  className={`
                    shrink-0
                    text-slate-400
                    transition-transform
                    duration-200
                    ${open ? "rotate-180" : ""}
                  `}
                />
              </button>

              {/* MONTH DROPDOWN */}
              {open && (
                <>
                  <div
                    className="
                      fixed inset-0 z-40
                      bg-slate-950/5
                    "
                    onClick={() =>
                      setOpen(false)
                    }
                  />

                  <div
                    className="
                      fixed
                      left-3 right-3
                      top-[76px]
                      z-50
                      rounded-2xl
                      border border-slate-200
                      bg-white
                      p-4
                      shadow-2xl

                      sm:absolute
                      sm:left-auto
                      sm:right-0
                      sm:top-auto
                      sm:mt-2
                      sm:w-80
                    "
                  >

                    <div className="mb-4 flex items-center justify-between">

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Select period
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          Choose month and year
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setOpen(false)
                        }
                        className="
                          flex h-8 w-8
                          items-center justify-center
                          rounded-lg
                          text-slate-400
                          transition
                          hover:bg-slate-100
                          hover:text-slate-700
                        "
                      >
                        <X size={16} />
                      </button>

                    </div>

                    {/* YEARS */}
                    <div className="mb-4">

                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Year
                      </p>

                      <div className="flex gap-2 overflow-x-auto pb-1">

                        {years.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              onChangeMonth(
                                month,
                                item
                              )
                            }
                            className={`
                              shrink-0
                              rounded-lg
                              px-3 py-2
                              text-xs
                              font-semibold
                              transition

                              ${
                                year === item
                                  ? "bg-emerald-500 text-white"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }
                            `}
                          >
                            {item}
                          </button>
                        ))}

                      </div>
                    </div>

                    {/* MONTHS */}
                    <div>

                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Month
                      </p>

                      <div className="grid grid-cols-3 gap-2">

                        {months.map((item) => {
                          const active =
                            month === item.value;

                          return (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => {
                                onChangeMonth(
                                  item.value,
                                  year
                                );

                                setOpen(false);
                              }}
                              className={`
                                rounded-xl
                                px-3 py-2.5
                                text-xs
                                font-semibold
                                transition

                                ${
                                  active
                                    ? "bg-emerald-500 text-white"
                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                }
                              `}
                            >
                              {item.label}
                            </button>
                          );
                        })}

                      </div>
                    </div>

                  </div>
                </>
              )}

            </div>

            {/* REFRESH */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="
                flex h-10 w-10
                shrink-0
                items-center justify-center
                rounded-xl
                border border-slate-200
                bg-white
                text-slate-500
                shadow-sm
                transition-all
                hover:bg-slate-50
                hover:text-slate-700
                disabled:opacity-60
              "
              title="Refresh dashboard"
              aria-label="Refresh dashboard"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

            {/* MOBILE LOGOUT */}
            <button
              type="button"
              onClick={onLogout}
              className="
                hidden
                h-10 w-10
                shrink-0
                items-center justify-center
                rounded-xl
                border border-slate-200
                bg-white
                text-slate-500
                shadow-sm
                transition-all
                hover:border-red-100
                hover:bg-red-50
                hover:text-red-500
                lg:flex
                lg:hidden
              "
            >
              <LogOut size={16} />
            </button>

          </div>
        </div>
      </header>

      {/* =========================================
          MOBILE DRAWER
      ========================================= */}
      {mobileMenuOpen && (
        <>
          {/* OVERLAY */}
          <div
            className="
              fixed inset-0 z-40
              bg-slate-950/50
              backdrop-blur-[2px]
              lg:hidden
            "
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />

          {/* DRAWER */}
          <aside
            className="
              fixed inset-y-0 left-0 z-50
              flex w-[285px]
              flex-col
              bg-slate-950
              text-white
              shadow-2xl
              lg:hidden
            "
          >

            {/* DRAWER HEADER */}
            <div
              className="
                flex h-[76px]
                shrink-0
                items-center
                justify-between
                border-b border-white/[0.07]
                px-4
              "
            >

              <button
                type="button"
                onClick={() =>
                  handleNavigation(
                    "/dashboard"
                  )
                }
                className="
                  flex items-center gap-3
                "
              >

                <div
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    bg-emerald-500
                    shadow-lg
                    shadow-emerald-500/20
                  "
                >
                  <Wallet
                    size={20}
                    strokeWidth={2.2}
                  />
                </div>

                <div className="text-left">

                  <p className="text-[17px] font-bold tracking-tight">
                    Money
                    <span className="text-emerald-400">
                      Split
                    </span>
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                    Personal Finance
                  </p>

                </div>
              </button>

              {/* CLOSE */}
              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-xl
                  text-slate-400
                  transition
                  hover:bg-white/[0.06]
                  hover:text-white
                "
                aria-label="Close menu"
              >
                <X size={19} />
              </button>

            </div>

            {/* NAVIGATION */}
            <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-6">

              <div className="mb-3 px-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                  Main Menu
                </p>
              </div>

              <div className="space-y-1">

                {menuItems.map((item) => {
                  const Icon = item.icon;

                  const active =
                    location.pathname ===
                    item.path;

                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() =>
                        handleNavigation(
                          item.path
                        )
                      }
                      className={`
                        group relative flex w-full
                        items-center gap-3
                        rounded-xl
                        px-3 py-2.5
                        text-[13px]
                        font-medium
                        transition-all

                        ${
                          active
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                            : "text-slate-400 hover:bg-white/[0.045] hover:text-slate-100"
                        }
                      `}
                    >

                      {active && (
                        <span
                          className="
                            absolute left-0 top-1/2
                            h-6 w-1
                            -translate-y-1/2
                            rounded-r-full
                            bg-emerald-300
                          "
                        />
                      )}

                      <span
                        className={`
                          flex h-8 w-8
                          shrink-0
                          items-center justify-center
                          rounded-lg

                          ${
                            active
                              ? "bg-white/15 text-white"
                              : "bg-white/[0.035] text-slate-500 group-hover:bg-white/[0.07] group-hover:text-slate-200"
                          }
                        `}
                      >
                        <Icon
                          size={17}
                          strokeWidth={2}
                        />
                      </span>

                      <span className="flex-1 text-left">
                        {item.label}
                      </span>
                    </button>
                  );
                })}

              </div>
            </nav>

            {/* DRAWER FOOTER */}
            <div className="shrink-0 border-t border-white/[0.07] p-3">

              <button
                type="button"
                onClick={onLogout}
                className="
                  flex w-full
                  items-center gap-3
                  rounded-xl
                  px-3 py-3
                  text-sm font-medium
                  text-slate-400
                  transition
                  hover:bg-red-500/10
                  hover:text-red-400
                "
              >

                <span
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-lg
                    bg-white/[0.035]
                  "
                >
                  <LogOut size={16} />
                </span>

                <span>Log out</span>

              </button>

            </div>

          </aside>
        </>
      )}
    </>
  );
}
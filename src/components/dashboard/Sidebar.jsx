import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Wallet,
  BarChart3,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

export default function Sidebar({
  user,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
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

  const getInitial = () => {
    return (
      user?.name
        ?.charAt(0)
        ?.toUpperCase() || "U"
    );
  };

  return (
    <aside
      className="
        fixed inset-y-0 left-0 z-40 hidden
        w-64
        border-r border-slate-800/80
        bg-slate-950
        text-white
        lg:block
      "
    >
      <div className="flex h-full flex-col">

        {/* =========================================
            BRAND
        ========================================= */}
        <div className="flex h-[76px] shrink-0 items-center border-b border-white/[0.07] px-5">

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="
              group flex items-center gap-3
              rounded-xl
              outline-none
            "
          >

            {/* Logo */}
            <div
              className="
                relative flex h-10 w-10
                shrink-0 items-center justify-center
                overflow-hidden rounded-xl
                bg-emerald-500
                shadow-lg shadow-emerald-500/20
                transition-all duration-200
                group-hover:scale-105
                group-active:scale-95
              "
            >
              <Wallet
                size={20}
                strokeWidth={2.2}
                className="relative z-10"
              />

              <div
                className="
                  absolute -right-3 -top-3
                  h-8 w-8 rounded-full
                  bg-white/10
                "
              />

              <div
                className="
                  absolute -bottom-4 -left-3
                  h-8 w-8 rounded-full
                  bg-black/10
                "
              />
            </div>

            {/* Brand */}
            <div className="text-left">
              <p className="text-[17px] font-bold tracking-tight text-white">
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
        </div>

        {/* =========================================
            NAVIGATION
        ========================================= */}
        <nav
          className="
            sidebar-scroll
            flex-1 overflow-y-auto
            px-3 py-6
          "
        >

          {/* Section title */}
          <div className="mb-3 px-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
              Main Menu
            </p>
          </div>

          {/* Navigation items */}
          <div className="space-y-1">

            {items.map((item) => {
              const Icon = item.icon;

              const active =
                location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() =>
                    navigate(item.path)
                  }
                  className={`
                    group relative flex w-full
                    items-center gap-3
                    rounded-xl
                    px-3 py-2.5
                    text-[13px] font-medium
                    outline-none
                    transition-all duration-200

                    ${
                      active
                        ? `
                          bg-emerald-500
                          text-white
                          shadow-md
                          shadow-emerald-500/10
                        `
                        : `
                          text-slate-400
                          hover:bg-white/[0.045]
                          hover:text-slate-100
                        `
                    }
                  `}
                >

                  {/* Active indicator */}
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

                  {/* Icon container */}
                  <span
                    className={`
                      flex h-8 w-8 shrink-0
                      items-center justify-center
                      rounded-lg
                      transition-all duration-200

                      ${
                        active
                          ? `
                            bg-white/15
                            text-white
                          `
                          : `
                            bg-white/[0.035]
                            text-slate-500
                            group-hover:bg-white/[0.07]
                            group-hover:text-slate-200
                          `
                      }
                    `}
                  >
                    <Icon
                      size={17}
                      strokeWidth={2}
                    />
                  </span>

                  {/* Label */}
                  <span className="flex-1 text-left">
                    {item.label}
                  </span>

                  {/* Arrow */}
                  <ChevronRight
                    size={15}
                    className={`
                      transition-all duration-200

                      ${
                        active
                          ? `
                            translate-x-0
                            opacity-80
                          `
                          : `
                            -translate-x-1
                            opacity-0
                            group-hover:translate-x-0
                            group-hover:opacity-50
                          `
                      }
                    `}
                  />
                </button>
              );
            })}

          </div>
        </nav>

        {/* =========================================
            BOTTOM USER AREA
        ========================================= */}
        <div
          className="
            shrink-0
            border-t border-white/[0.07]
            bg-slate-950
            p-3
          "
        >

          {/* User profile */}
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="
              group mb-2 flex w-full
              items-center gap-3
              rounded-xl
              p-2.5
              text-left
              outline-none
              transition-all duration-200
              hover:bg-white/[0.045]
            "
          >

            {/* Avatar */}
            <div className="relative shrink-0">

              <div
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-emerald-400
                  to-emerald-600
                  text-sm font-bold text-white
                  shadow-md shadow-emerald-500/10
                "
              >
                {getInitial()}
              </div>

              {/* Online indicator */}
              <span
                className="
                  absolute bottom-0 right-0
                  h-2.5 w-2.5
                  rounded-full
                  border-2 border-slate-950
                  bg-emerald-400
                "
              />

            </div>

            {/* User details */}
            <div className="min-w-0 flex-1">

              <p className="truncate text-[13px] font-semibold text-slate-100">
                {user?.name || "User"}
              </p>

              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                {user?.email || "Personal account"}
              </p>

            </div>

            <ChevronRight
              size={15}
              className="
                shrink-0
                text-slate-600
                transition-all duration-200
                group-hover:translate-x-0.5
                group-hover:text-slate-400
              "
            />

          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="
              group flex w-full
              items-center gap-3
              rounded-xl
              px-3 py-2.5
              text-[13px] font-medium
              text-slate-500
              outline-none
              transition-all duration-200
              hover:bg-red-500/10
              hover:text-red-400
            "
          >

            <span
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-lg
                bg-white/[0.035]
                transition
                group-hover:bg-red-500/10
              "
            >
              <LogOut size={16} />
            </span>

            <span>Log out</span>

          </button>

        </div>
      </div>
    </aside>
  );
}
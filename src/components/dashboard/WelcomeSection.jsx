export default function WelcomeSection({
  user,
  month,
  year,
}) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  const monthName = new Date(
    year,
    month - 1,
    1
  ).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const firstName =
    user?.name?.split(" ")[0] || "there";

  return (
    <section className="mb-6 sm:mb-7">
      <div className="flex items-start justify-between gap-4">

        {/* LEFT CONTENT */}
        <div className="min-w-0">

          {/* Greeting */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 sm:text-base">
              {greeting}
            </span>

            <span className="text-base sm:text-lg">
              👋
            </span>
          </div>

          {/* Name */}
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Hey, {firstName}
          </h1>

          {/* Description */}
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px]">
            Here's your financial overview for{" "}
            <span className="font-semibold text-slate-700">
              {monthName}
            </span>
            .
          </p>

        </div>

        {/* MONTH BADGE */}
        <div className="hidden shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:block">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Viewing
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {monthName}
          </p>
        </div>

      </div>
    </section>
  );
}
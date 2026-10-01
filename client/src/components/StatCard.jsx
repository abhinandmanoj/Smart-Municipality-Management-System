function StatCard({
  title,
  value,
  icon,
  color,
  bg,
  change = "+12%",
}) {
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-3xl
      p-7
      shadow-xl
      border
      border-gray-700
      hover:scale-105
      duration-300
      group
      "
      style={{ background: bg }}
    >

      {/* Glow */}

      <div
        className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20"
        style={{ background: color }}
      />

      {/* Top */}

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-400 text-sm uppercase tracking-wider">

            {title}

          </p>

          <h2 className="text-5xl font-bold text-white mt-3">

            {value}

          </h2>

        </div>

        <div
          className="w-16 h-16 rounded-2xl flex justify-center items-center shadow-lg"
          style={{ background: color }}
        >

          {icon}

        </div>

      </div>

      {/* Bottom */}

      <div className="mt-8 flex justify-between items-center">

        <span className="text-green-400 font-semibold">

          {change}

        </span>

        <span className="text-gray-500">

          This Month

        </span>

      </div>

      {/* Bottom Border */}

      <div
        className="absolute left-0 bottom-0 h-1 w-full"
        style={{ background: color }}
      />

    </div>
  );
}

export default StatCard;
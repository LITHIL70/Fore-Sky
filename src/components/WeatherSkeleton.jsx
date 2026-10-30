function WeatherSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading weather dashboard" role="status">
      <span className="sr-only">Loading weather information...</span>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.78fr_1.15fr]">
        {[1, 2, 3].map((cardNumber) => (
          <div key={cardNumber} className="glass-panel min-h-[300px] animate-pulse rounded-[26px] p-6">
            <div className="h-5 w-36 rounded-lg bg-white/20" />
            <div className="mt-5 h-3 w-24 rounded bg-white/15" />
            <div className="mt-8 h-16 w-32 rounded-xl bg-white/20" />
            <div className="mt-6 h-24 rounded-2xl bg-white/10" />
            <div className="mt-5 h-3 w-3/4 rounded bg-white/15" />
          </div>
        ))}
      </section>

      <section className="glass-panel grid grid-cols-2 gap-4 rounded-[24px] p-5 sm:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((itemNumber) => (
          <div key={itemNumber} className="animate-pulse space-y-3 rounded-xl p-2">
            <div className="h-3 w-20 rounded bg-white/20" />
            <div className="h-6 w-24 rounded bg-white/15" />
            <div className="h-2 w-16 rounded bg-white/10" />
          </div>
        ))}
      </section>

      <section className="glass-panel rounded-[24px] p-5">
        <div className="h-5 w-40 animate-pulse rounded bg-white/20" />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((itemNumber) => (
            <div key={itemNumber} className="h-28 animate-pulse rounded-2xl bg-white/10" />
          ))}
        </div>
      </section>
    </div>
  );
}

export default WeatherSkeleton;

export function StatsSection() {
  const stats = [
    { label: "Templates", value: "50+" },
    { label: "Evaluations", value: "10K+" },
    { label: "Students", value: "5K+" },
    { label: "Success Rate", value: "95%" },
  ]

  return (
    <section className="border-b border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold md:text-5xl">{stat.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

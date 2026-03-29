export default function Loading() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-10">
          <div className="skeleton h-4 w-32 mb-4" />
          <div className="skeleton h-10 w-3/4 mb-3" />
          <div className="skeleton h-5 w-1/2" />
        </div>

        {/* Controls skeleton */}
        <div className="flex gap-3 mb-8">
          <div className="skeleton h-10 w-48 rounded-xl" />
          <div className="skeleton h-10 w-32 rounded-xl" />
          <div className="skeleton h-10 w-32 rounded-xl" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="flex justify-between mb-4">
                <div className="skeleton h-5 w-32" />
                <div className="skeleton h-5 w-16" />
              </div>
              <div className="skeleton h-4 w-48 mb-6" />
              <div className="flex gap-6">
                <div>
                  <div className="skeleton h-3 w-20 mb-2" />
                  <div className="skeleton h-8 w-24" />
                </div>
                <div>
                  <div className="skeleton h-3 w-20 mb-2" />
                  <div className="skeleton h-8 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

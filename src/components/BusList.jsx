import BusCard from "./BusCard";

export default function BusList({ results, hasSearched }) {
  // 🔕 Before any valid search: show nothing at all
  if (!hasSearched) {
    return null;
  }

  // ❗ After a search, but no matches found
  if (!results || results.length === 0) {
    return (
      <div className="text-center text-xs md:text-sm text-slate-500 mt-8">
        No buses found for this source and destination. Select a valid pair of
        stops from the dropdowns above.
      </div>
    );
  }

  // ✅ Buses found – show cards
  return (
    <div className="max-w-6xl mx-auto mt-6 px-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {results.map(({ route, bus }) => (
        <BusCard key={bus.id + route.id} route={route} bus={bus} />
      ))}
    </div>
  );
}

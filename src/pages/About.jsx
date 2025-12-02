export default function About() {
  return (
    <div className="flex justify-center mt-8 px-4 pb-10">
      <div className="bg-white rounded-2xl shadow-md max-w-5xl w-full p-6 md:p-8">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-emerald-500 text-xl">●</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold">
            About Smart Public Bus Tracker
          </h1>
        </div>

        {/* What is it section */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">What is it?</h2>
          <p className="text-sm md:text-base text-slate-700 leading-relaxed">
            Smart Public Bus Tracker is a concept application that helps passengers
            check local buses using structured route and stop data. In a real
            deployment, this information can be synced from electronic ticketing
            machines or transport databases, so passengers get live visibility of
            buses without tracking the driver&apos;s mobile phone.
          </p>
        </section>

        {/* 4 feature cards */}
        <section className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Real-time Information */}
          <div className="border border-slate-200 rounded-xl p-4 flex gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-500 text-lg">🚌</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-sm md:text-base">
                Real-time Information
              </h3>
              <p className="text-xs md:text-sm text-slate-600">
                Get live-style updates on bus locations, ETAs and current status for
                better trip planning.
              </p>
            </div>
          </div>

          {/* User-Friendly */}
          <div className="border border-slate-200 rounded-xl p-4 flex gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-500 text-lg">🙂</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-sm md:text-base">
                User-Friendly
              </h3>
              <p className="text-xs md:text-sm text-slate-600">
                Simple, clean interface designed for passengers of all ages and
                tech-comfort levels.
              </p>
            </div>
          </div>

          {/* Fast & Efficient */}
          <div className="border border-slate-200 rounded-xl p-4 flex gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-500 text-lg">⚡</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-sm md:text-base">
                Fast &amp; Efficient
              </h3>
              <p className="text-xs md:text-sm text-slate-600">
                Quick source–destination search lets you find buses on your route in
                seconds.
              </p>
            </div>
          </div>

          {/* Privacy-Focused */}
          <div className="border border-slate-200 rounded-xl p-4 flex gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-500 text-lg">🔒</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-sm md:text-base">
                Privacy-Focused
              </h3>
              <p className="text-xs md:text-sm text-slate-600">
                Uses data from ticketing systems and central servers, not the
                driver&apos;s personal phone, ensuring privacy.
              </p>
            </div>
          </div>
        </section>

        {/* Coverage Area */}
        <section className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Coverage Area</h2>
          <p className="text-sm md:text-base text-slate-700 mb-2">
            The prototype is designed around the Chikkaballapur region with
            sample data representing:
          </p>
          <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-1">
            <li>Bengaluru to Chikkaballapur routes</li>
            <li>Airport connectivity routes (via Devanahalli, NCET, Nandi Upachar)</li>
            <li>Local inter-city connections like Chintamani, Sidlaghatta, Kolar</li>
            <li>Major town and village stops in the surrounding region</li>
          </ul>
        </section>

        {/* Footer note */}
        <p className="text-xs md:text-sm text-slate-500 mt-4 italic">
          This is a concept application created for demonstration and academic
          purposes. It showcases how modern web technology can improve public
          transportation accessibility and passenger experience without requiring
          any change to citizens&apos; personal devices.
        </p>
      </div>
    </div>
  );
}

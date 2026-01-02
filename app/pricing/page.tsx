// app/pricing/page.tsx
export default function PricingPage() {
  return (
    <main className="max-w-5xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-semibold">Pricing</h1>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Free",
            price: "₹0",
            features: [
              "Manual verification",
              "Trust Score summary",
              "Bring your own API key",
            ],
          },
          {
            title: "Pro",
            price: "₹899 / mo",
            features: [
              "Saved reports",
              "Fix packs",
              "PDF export",
              "Higher limits",
            ],
          },
          {
            title: "Teams",
            price: "Custom",
            features: [
              "Regression suites",
              "Audit logs",
              "Compliance exports",
            ],
          },
        ].map((tier) => (
          <div
            key={tier.title}
            className="border rounded-lg p-6 bg-white"
          >
            <h2 className="font-medium text-lg">{tier.title}</h2>
            <p className="mt-2 text-2xl font-semibold">{tier.price}</p>

            <ul className="mt-4 space-y-2 text-sm text-neutral-600">
              {tier.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}

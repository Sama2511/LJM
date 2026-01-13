import Link from "next/link";

export default function PaymentPage() {
  return (
    <section className="flex min-h-screen w-full justify-center bg-background px-4 pt-20">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold font-chillax text-foreground mb-10">
          Make a difference Today
        </h1>

        <div className="mb-4 flex items-center justify-between">
         <Link href="/donation/details" className="text-sm text-foreground flex items-center gap-1 mb-4">
          <span className="text-xl">←</span> back
        </Link>

          <div className="rounded-lg border border-border bg-muted px-4 py-2 text-center text-sm font-medium">
            $50
            <br />
            per month
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6 shadow-md">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="John Smith"
              className="w-full rounded-lg border border-border p-3"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 8901 2394"
              className="w-full rounded-lg border border-border p-3"
            />
          </div>

          <div className="mb-5 grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full rounded-lg border border-border p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">CVC</label>
              <input
                type="text"
                placeholder="123"
                className="w-full rounded-lg border border-border p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Postal Code
              </label>
              <input
                type="text"
                placeholder="2000"
                className="w-full rounded-lg border border-border p-3"
              />
            </div>
          </div>

          <div className="mb-5 flex gap-3">
            <button className="flex w-1/2 items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-background shadow">
               Pay
            </button>

            <button className="w-1/2 rounded-lg bg-ring py-3 text-foreground shadow">
              G Pay
            </button>
          </div>

          <button className="w-full rounded-xl bg-primary py-4 text-lg font-semibold text-primary-foreground shadow hover:bg-primary/90 transition">
            Complete donation
          </button>
        </div>
      </div>
    </section>
  );
}

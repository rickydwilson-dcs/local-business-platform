/**
 * ContentCheckout
 *
 * Content section: Checkout
 * Layout: contained
 * Category: Content
 */

export interface ContentCheckoutProps {
  /** heading */
  heading?: string;
  /** body */
  body?: string;
}

export function ContentCheckout(props: ContentCheckoutProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {props.heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
            {props.heading}
          </h2>
        )}
        {props.body && (
          <p className="text-surface-muted-foreground text-lg mb-8">
            {props.body}
          </p>
        )}
        <div className="bg-surface-foreground rounded-2xl p-8 md:p-12 shadow-sm border border-surface-muted">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-left">
              <label className="text-sm font-medium text-surface-background" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div className="flex flex-col gap-2 text-left">
              <label className="text-sm font-medium text-surface-background" htmlFor="card">
                Card number
              </label>
              <input
                id="card"
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 text-left">
                <label className="text-sm font-medium text-surface-background" htmlFor="expiry">
                  Expiry date
                </label>
                <input
                  id="expiry"
                  type="text"
                  placeholder="MM / YY"
                  className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <div className="flex flex-col gap-2 text-left">
                <label className="text-sm font-medium text-surface-background" htmlFor="cvc">
                  CVC
                </label>
                <input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-brand-primary text-on-brand-primary font-semibold text-base py-4 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            >
              Complete purchase
            </button>
            <p className="text-sm text-surface-muted-foreground text-center">
              Your payment is secured with 256-bit SSL encryption.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

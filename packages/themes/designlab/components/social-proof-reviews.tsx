"use client";
import { RevealOnScroll, Carousel } from "@platform/core-components/components/animation";
export function SocialProofReviews({
  heading = "What Our Clients Say",
  reviews = [
    {
      name: "Sarah Mitchell",
      rating: 5,
      text: "Absolutely phenomenal work on our fleet vehicles. The quality of the wrap is stunning and the turnaround was incredibly fast. Highly recommend DesignLab to any business.",
      date: "2 weeks ago",
    },
    {
      name: "James Cooper",
      rating: 5,
      text: "From the initial design consultation to the final installation, every step was professional and seamless. Our new shop front looks incredible.",
      date: "1 month ago",
    },
    {
      name: "Rachel Dunn",
      rating: 5,
      text: "We needed exhibition materials at short notice and DesignLab delivered beautifully. The team went above and beyond. Will definitely use again for future events.",
      date: "3 weeks ago",
    },
    {
      name: "Tom Hargreaves",
      rating: 5,
      text: "Best signage company in Eastbourne, hands down. Creative, reliable, and the results speak for themselves. Our building signage is a real head-turner now.",
      date: "1 month ago",
    },
  ],
}) {
  return (
    <section className="section bg-surface-background relative overflow-hidden">
      {/* Decorative brand accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary" />

      <div className="container-standard mx-auto px-6">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-h2 font-heading font-bold text-surface-foreground mb-2">
              {heading}
            </h2>
            <div className="flex items-center justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-brand-primary text-h3">
                  ★
                </span>
              ))}
            </div>
            <p className="text-small font-sans text-surface-muted-foreground mt-2 tracking-wide">
              5.0 average from 120+ Google reviews
            </p>
          </div>
        </RevealOnScroll>

        <Carousel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map(
              (
                review: { name: string; rating: number; text: string; date?: string },
                i: number
              ) => (
                <RevealOnScroll key={i}>
                  <div className="bg-brand-secondary p-8 min-w-0 min-w-[60%] relative group">
                    {/* Giant decorative quote mark */}
                    <span
                      className="absolute top-4 right-6 text-brand-primary opacity-20 font-heading leading-none"
                      style={{ fontSize: "6rem" }}
                    >
                      "
                    </span>

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(review.rating)].map((_, j) => (
                        <span key={j} className="text-brand-primary text-body">
                          ★
                        </span>
                      ))}
                    </div>

                    <p className="text-body font-sans text-surface-foreground leading-relaxed mb-6 relative z-10 max-w-2xl">
                      "{review.text}"
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-small font-heading font-bold text-surface-foreground uppercase tracking-wide">
                        {review.name}
                      </span>
                      {review.date && (
                        <span className="text-caption font-sans text-surface-muted-foreground">
                          {review.date}
                        </span>
                      )}
                    </div>
                  </div>
                </RevealOnScroll>
              )
            )}
          </div>
        </Carousel>
      </div>
    </section>
  );
}

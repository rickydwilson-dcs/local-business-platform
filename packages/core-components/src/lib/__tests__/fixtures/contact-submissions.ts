/**
 * Labelled contact-submission corpus for `assessSubmission`.
 *
 * ## Provenance
 *
 * Every entry marked `source: 'production'` is a real submission, recovered
 * from the Resend API's retained history (3–29 September 2026) across the
 * `dcs` and `colossus-scaffolding` contact forms. They are here because
 * hand-authored spam fixtures encode the author's assumptions about what spam
 * looks like, and those assumptions are exactly what a scorer needs testing
 * against. Two calibration findings in `spam-score.ts` came from these and
 * contradicted the first draft of the rules.
 *
 * ## Anonymisation — read before adding to this file
 *
 * These were enquiries from real members of the public to a client's business.
 * Their names, email addresses, phone numbers and street addresses are personal
 * data and are **not** committed here. Each entry keeps only the three fields
 * the scorer actually reads (`email`, `phone`, `message`), with:
 *
 *   - names replaced, in the body text as well as the field;
 *   - email addresses replaced with `@example.com`, preserving only the
 *     local-part token that carries a signal (`strategist`, `growthseo`) —
 *     the behaviour being tested, not the person;
 *   - phone numbers replaced with same-shape fakes, so a `+91` stays a non-UK
 *     international prefix and an `0800` stays a UK freephone;
 *   - street names replaced; towns and counties kept, as those are not
 *     identifying and the message's shape matters.
 *
 * Subjects are deliberately omitted — one carried a full residential address
 * and the scorer does not read subjects anyway.
 *
 * When adding a new fixture, anonymise it the same way. Never paste a raw
 * submission in.
 */

export interface CorpusEntry {
  id: string;
  label: "spam" | "ham";
  /** Which site's form it arrived through, or the site it is written for. */
  site: "dcs" | "colossus-scaffolding";
  /** `production` = a real submission, anonymised. `synthetic` = hand-written. */
  source: "production" | "synthetic";
  /** Why this entry is in the corpus — what it is guarding. */
  note: string;
  email: string;
  phone: string | null;
  message: string;
}

export const CONTACT_CORPUS: CorpusEntry[] = [
  // ---------------------------------------------------------------- spam ----
  {
    id: "spam-link-building-pitch",
    label: "spam",
    site: "dcs",
    source: "production",
    note: "Saturated with outreach-trade jargon. The easy case; caught by several independent groups.",
    email: "digitalstrategist.pg@example.com",
    phone: "+91 90000 00000",
    message:
      "Hello Team, Hope you are doing well and staying safe!! I provide high-quality guest posting " +
      "and link-building services designed to boost your SEO performance. I have access to " +
      "high-authority websites across various niches with strong DA, DR, and organic traffic. Our " +
      "placements include: Permanent, do-follow links; 100% Google indexing; No sponsored tags; " +
      "Competitive pricing. We offer sites in numerous categories, including UK Blog, Business, " +
      "Finance, Travel, Fashion, Home Decorating, Shopping, Education, Real Estate, Health, Auto, " +
      "Law, Pets, Sports & Game, Foods, Technology, and many more.. I would love to support your " +
      "business promotion projects. Please let me know if you are interested, and I will send over " +
      "our site lists for your review. Best regards!",
  },
  {
    id: "spam-seo-proposal-no-jargon",
    label: "spam",
    site: "colossus-scaffolding",
    source: "production",
    note:
      "The hard case, and the reason scoring is additive. Uses NONE of the link-building " +
      "vocabulary, carries a UK freephone number so the phone signal does not fire, and picked a " +
      "real service and location from the form. Only the offer grammar and the sender local part " +
      "give it away. A keyword-only rule misses this entirely.",
    email: "j.growthseo@example.com",
    phone: "0800 000 0000",
    message:
      "Hi, I would like to send you a proposal for your website. The proposal will show a few " +
      "things to help improve your search results significantly and attract more customers. If " +
      "you're interested, I'd be happy to send a proposal with pricing, Warm Regards",
  },

  // ----------------------------------------------------------------- ham ----
  {
    id: "ham-church-scaffolding",
    label: "ham",
    site: "colossus-scaffolding",
    source: "production",
    note:
      'THE critical fixture. A genuine enquiry that opens with a generic pleasantry ("I hope ' +
      'you\'re well") AND contains "more than happy to send over some marked up photos". A naive ' +
      '"generic opener" rule or a bare "happy to send" rule flags this real customer. It is why ' +
      "the opener weight is 1 and why every sales-offer pattern requires a selling object.",
    email: "l.donoghue@example.com",
    phone: "07000 000001",
    message:
      "Hello, I hope you're well, I was hoping to get a price for scaffolding to be erected and " +
      "dismantled at a church near Battle, Kent. If you could send me an email, I’ll be more " +
      "than happy to send over some marked up photos to help you build your quote. Kind regards",
  },
  {
    id: "ham-repointing",
    label: "ham",
    site: "colossus-scaffolding",
    source: "production",
    note: "Ordinary trade enquiry. Should score zero.",
    email: "m.edwards@example.com",
    phone: "07000 000002",
    message:
      "We have a three-storey end of terrace on a residential street in Margate. We have " +
      "repointing due to start on 8th October and need scaffold to front, side and rear.",
  },
  {
    id: "ham-house-painting",
    label: "ham",
    site: "colossus-scaffolding",
    source: "production",
    note: "Ordinary trade enquiry, informal spelling. Should score zero.",
    email: "l.meredith@example.com",
    phone: "07000 000003",
    message:
      "We own a semi detatched house in Hastings that needs painting. Also need chimney access, " +
      "not sure what type of scaffolding we need. Can you please quote",
  },
  {
    id: "ham-scaffold-tower",
    label: "ham",
    site: "colossus-scaffolding",
    source: "production",
    note: 'Ordinary trade enquiry, describes a third party ("prospective roofer"). Should score zero.',
    email: "h.sullivan@example.com",
    phone: "07000 000004",
    message:
      "Small roofing work at fairly inaccessible third floor level. Should only be a one- or " +
      "two-day job. Prospective roofer has advised he needs a two-metre wide scaffold from which " +
      "to erect a ladder.",
  },
  {
    id: "ham-very-short",
    label: "ham",
    site: "dcs",
    source: "production",
    note:
      "A near-empty message. Guards against the scorer treating brevity or lack of detail as " +
      "suspicious — a genuine enquirer often writes almost nothing.",
    email: "r.w@example.com",
    phone: null,
    message: "la la la and test",
  },
  {
    id: "ham-dcs-customer-using-seo-vocabulary",
    label: "ham",
    site: "dcs",
    source: "synthetic",
    note:
      "Hand-written, and the only synthetic entry. Exercises the preset layer: a DCS customer " +
      "REQUESTING the services a spammer OFFERS. Under the bare baseline this scores above the " +
      "threshold on vocabulary alone; the ProfessionalService preset exempts those terms because " +
      "on a site that sells SEO they are a customer describing what they want to buy. Scored " +
      "against the trades baseline it is expected to flag — that difference IS the test.",
    email: "hello@a-real-joinery.example.com",
    phone: "07000 000005",
    message:
      "Hi, I hope you're well. We run a small joinery in Bexhill and we'd like more organic " +
      "traffic to the site, plus better SERP positions for our main services. Can you tell us " +
      "what that would cost?",
  },
];

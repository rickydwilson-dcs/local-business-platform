import {
  TopNavigation,
  BlogPageBanner,
  BlogPostBody,
  NewsletterSignupCTA,
  SiteFooter,
} from '@platform/themes/rigel/components';

export default function BlogPostPage() {
  return (
    <>
      {/* Source: https://colorcode.events/blog/announcing-the-colorcode-art-battle — blog-post blueprint */}
      <TopNavigation logo="/images/colorcode-buffalo-logo-white.svg" />
      <BlogPageBanner sectionLabel="Blog" />
      <BlogPostBody
        postTitle="Announcing the ColorCode Art Battle"
        postDate="March 15, 2025"
        postBodyText={[
          "We are thrilled to announce a brand-new addition to the ColorCode Buffalo 2025 experience — the ColorCode Art Battle! This exciting live competition will bring together talented local artists for a high-energy creative showdown that promises to be one of the most memorable moments of the conference.",
          "The Art Battle will take place during the Saturday evening session, giving attendees a front-row seat to watch artists create stunning works in real time. Each artist will have a limited time to complete their piece, adding an element of excitement and spontaneity to the competition.",
          "But the Art Battle is more than just a competition — it is a celebration of the creative spirit that drives our community. Whether you are a designer, developer, or marketer, there is something deeply inspiring about watching raw creativity unfold before your eyes.",
          "We will be announcing the participating artists in the coming weeks, so stay tuned to our blog and social channels for updates. If you are an artist interested in participating, we would love to hear from you — reach out through our contact page.",
        ]}
        inlineImageRight={{
          src: "/images/color-code-buffalo-2025-bolling-768x512.jpg",
          alt: "ColorCode Buffalo 2025 event",
        }}
        numberedList={[
          "Live art creation with a time limit for maximum energy",
          "Audience voting to crown the champion",
          "All artwork auctioned with proceeds supporting local arts programs",
          "Networking and refreshments throughout the event",
          "Special guest judges from the Buffalo arts community",
        ]}
        inlineImageLeft={{
          src: "/images/Untitled_Artwork-2-scaled.jpg",
          alt: "Art Battle artwork preview",
        }}
        authorSignature="ColorCode Events Team"
        backToBlogLink="/blog"
      />
      <NewsletterSignupCTA />
      <SiteFooter />
    </>
  );
}

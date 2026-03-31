import {
  TopNavigation,
  PageTitleBanner,
  BlogPostGrid,
  NewsletterSignupCTA,
  SiteFooter,
} from '@platform/themes/rigel/components';

export default function BlogPage() {
  return (
    <>
      {/* Source: https://colorcode.events/blog — blog-list blueprint */}
      <TopNavigation logo="/images/colorcode-buffalo-logo-white.svg" />
      <PageTitleBanner pageTitle="Blog" />
      <BlogPostGrid
        posts={[
          {
            thumbnail: "/images/color-code-buffalo-2025-bolling-768x512.jpg",
            title: "Announcing the ColorCode Art Battle",
            date: "March 15, 2025",
            excerpt: "We are thrilled to announce a brand-new addition to the ColorCode Buffalo 2025 experience — the ColorCode Art Battle! This exciting live competition will bring together talented local artists for a high-energy creative showdown.",
            href: "/blog/announcing-the-colorcode-art-battle",
          },
          {
            thumbnail: "/images/color-code-buffalo-2025-cleary-768x512.jpg",
            title: "ColorCode Buffalo 2025 Speaker Lineup",
            date: "February 28, 2025",
            excerpt: "Meet the incredible speakers joining us for ColorCode Buffalo 2025. From design leaders to tech innovators, this year's lineup promises to inspire and challenge the way you think about creativity.",
            href: "/blog/colorcode-buffalo-2025-speakers",
          },
          {
            thumbnail: "/images/Untitled_Artwork-2-300x187.jpg",
            title: "The Power of Community in Tech",
            date: "January 10, 2025",
            excerpt: "Why local tech communities matter more than ever, and how ColorCode Events is building bridges between designers, developers, and marketers in Buffalo and beyond.",
            href: "/blog/power-of-community-in-tech",
          },
          {
            thumbnail: "/images/colorcode-buffalo-share.jpg",
            title: "What to Expect at ColorCode Buffalo",
            date: "December 5, 2024",
            excerpt: "A first-timer's guide to ColorCode Buffalo — from keynote sessions and hands-on workshops to networking opportunities and the legendary after-party.",
            href: "/blog/what-to-expect-at-colorcode-buffalo",
          },
        ]}
      />
      <NewsletterSignupCTA />
      <SiteFooter />
    </>
  );
}

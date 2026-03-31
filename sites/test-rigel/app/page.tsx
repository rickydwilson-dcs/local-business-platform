import {
  TopNavigation,
  HeroHeadline,
  EventDetailsBanner,
  CallForSpeakersCTA,
  CallForSponsorsCTA,
  CallForVolunteersCTA,
  BlogPreviewCards,
  ColorCodeEventsAbout,
  EventPhotoGallery,
  NewsletterSignupCTA,
  SiteFooter,
} from '@platform/themes/rigel/components';

export default function HomePage() {
  return (
    <>
      {/* Source: https://colorcode.events/ — home blueprint */}
      <TopNavigation logo="/images/colorcode-buffalo-logo-white.svg" />
      <HeroHeadline />
      <EventDetailsBanner
        backgroundImage={{ src: '/images/color-code-buffalo-2025-cleary-768x512.jpg', alt: 'ColorCode Buffalo 2025' }}
      />
      <CallForSpeakersCTA />
      <CallForSponsorsCTA />
      <CallForVolunteersCTA />
      <BlogPreviewCards
        sectionHeading="From the Blog"
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
        ]}
      />
      <ColorCodeEventsAbout
        sectionHeading="About ColorCode Events"
        bodyText="ColorCode Events is a community-driven tech and design conference based in Buffalo, NY. We bring together designers, developers, and marketers to share ideas, build connections, and push the boundaries of creative technology. Our events celebrate diversity, innovation, and the power of collaboration."
        learnMoreButton={{ label: "Learn More", href: "/about" }}
      />
      <EventPhotoGallery
        photo1={{ src: "/images/color-code-buffalo-2025-bolling-768x512.jpg", alt: "ColorCode Buffalo 2025 event" }}
        photo2={{ src: "/images/color-code-buffalo-2025-cleary-768x512.jpg", alt: "Speaker presentation at ColorCode" }}
        photo3={{ src: "/images/colorcode-buffalo-share.jpg", alt: "ColorCode Buffalo community" }}
        photo4={{ src: "/images/CCE_Speaker-1_1000x1000.png", alt: "Featured speaker at ColorCode" }}
        photo5={{ src: "/images/CCE_Sponsor-1_1000x1000.png", alt: "Event sponsors" }}
      />
      <NewsletterSignupCTA />
      <SiteFooter />
    </>
  );
}

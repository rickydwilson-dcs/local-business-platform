import {
  TopNavigation,
  PageTitleBanner,
  HowItStarted,
  TeamBioBenDunkle,
  TeamBioRonBrennan,
  TeamBioTimBouchard,
  NewsletterSignupCTA,
  SiteFooter,
} from '@platform/themes/rigel/components';

export default function AboutPage() {
  return (
    <>
      {/* Source: https://colorcode.events/about — about blueprint */}
      <TopNavigation logo="/images/colorcode-buffalo-logo-white.svg" />
      <PageTitleBanner pageTitle="About ColorCode Events" />
      <HowItStarted />
      <TeamBioBenDunkle
        memberName="Ben Dunkle"
        memberTitle="Partner & Creative Director"
        memberImage={{ src: "/images/ben-dunkle.jpg", alt: "Ben Dunkle" }}
        bioText="Ben brings over two decades of experience shaping brand identities and creative strategies for organisations across the globe. His work sits at the intersection of storytelling and design, helping teams communicate with clarity, purpose, and impact. Ben is passionate about building cultures where creativity thrives and ideas are given the space to grow."
        linkedinLink="https://www.linkedin.com/in/bendunkle"
      />
      <TeamBioRonBrennan
        memberName="Ron Brennan"
        memberTitle="Co-Founder & Chief Executive Officer"
        memberImage={{ src: "/images/ron-brennan.jpg", alt: "Ron Brennan" }}
        bioText="Ron Brennan is a seasoned technology executive with over two decades of experience building and scaling enterprise software companies. His passion for innovation and deep expertise in product strategy have been instrumental in shaping the company's vision and driving growth across global markets."
        linkedinLink="https://www.linkedin.com/in/ronbrennan"
      />
      <TeamBioTimBouchard
        memberName="Tim Bouchard"
        memberTitle="Founder & Creative Director"
        bioText="Tim Bouchard is a seasoned creative strategist with over a decade of experience building brands that resonate. His work bridges the gap between bold design thinking and measurable business outcomes, helping organizations tell their stories with clarity and conviction."
        linkedinLink="https://www.linkedin.com/in/timbouchard"
        agencyLink="https://www.competitivecreative.com"
      />
      <NewsletterSignupCTA />
      <SiteFooter />
    </>
  );
}

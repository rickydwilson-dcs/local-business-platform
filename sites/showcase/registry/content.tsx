import { FAQSection, SectionWrapper } from '@platform/core-components';
import type { ElementDefinition } from './index';

const renderFaq = () => (
  <FAQSection
    title="Frequently Asked Questions"
    description="Common questions about our services"
    items={[
      {
        question: 'How quickly can you respond to an emergency?',
        answer: 'We aim to have an engineer at your door within 60 minutes for emergency callouts. Our 24/7 helpline ensures you can always reach us.',
      },
      {
        question: 'Do you offer free quotes?',
        answer: 'Yes, all initial consultations and quotes are completely free and come with no obligation. We believe in transparent, upfront pricing.',
      },
      {
        question: 'Are you fully insured and certified?',
        answer: 'Absolutely. All our engineers hold current industry certifications and we carry comprehensive public liability insurance.',
      },
    ]}
  />
);

const renderSectionWrapper = () => (
  <SectionWrapper>
    <div className="text-center">
      <h2 className="heading-section">Section Title Goes Here</h2>
      <p className="text-subtitle max-w-2xl mx-auto">
        This is a standard section wrapper providing consistent vertical padding and horizontal centering for page content.
      </p>
    </div>
  </SectionWrapper>
);

export const contentElements: ElementDefinition[] = [
  {
    slug: 'faq-section',
    name: 'FAQ Section',
    category: 'Content',
    description: 'Accordion-style frequently asked questions with expandable answers',
    renders: {
      orion: renderFaq,
      vega: renderFaq,
    },
  },
  {
    slug: 'section-wrapper',
    name: 'Section Wrapper',
    category: 'Content',
    description: 'Reusable content section container with consistent padding',
    renders: {
      orion: renderSectionWrapper,
      vega: renderSectionWrapper,
    },
  },
];

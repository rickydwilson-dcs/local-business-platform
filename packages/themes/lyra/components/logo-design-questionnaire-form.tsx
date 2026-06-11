/**
 * LogoDesignQuestionnaireForm
 *
 * Multi-field questionnaire form collecting business info, design preferences, target audience, logo style, colour preferences and signature for a logo design brief
 * Layout: Single-column card container with two-column field rows, checkboxes, file upload, visual style selector with logo type examples and signature field
 * Category: Custom
 */
export interface LogoDesignQuestionnaireFormProps {
  /** name-fields */
  nameFields?: string;
  /** business-name */
  businessName?: string;
  /** email */
  email?: string;
  /** service-description */
  serviceDescription?: string;
  /** logo-goals */
  logoGoals?: string;
  /** competitors */
  competitors?: string;
  /** differentiators */
  differentiators?: string;
  /** age-range-checkboxes */
  ageRangeCheckboxes?: string;
  /** tagline-field */
  taglineField?: string;
  /** imagery-field */
  imageryField?: { src?: string; alt?: string };
  /** logo-usage-checkboxes */
  logoUsageCheckboxes?: string;
  /** colour-preferences */
  colourPreferences?: string;
  /** colours-to-avoid */
  coloursToAvoid?: string;
  /** feeling-message */
  feelingMessage?: string;
  /** logo-appeal */
  logoAppeal?: string;
  /** visual-examples-upload */
  visualExamplesUpload?: string;
  /** visual-style-selector */
  visualStyleSelector?: string;
  /** wordmark-examples */
  wordmarkExamples?: string;
  /** lettermark-examples */
  lettermarkExamples?: string;
  /** brandmark-examples */
  brandmarkExamples?: string;
  /** combination-mark-examples */
  combinationMarkExamples?: string;
  /** emblem-examples */
  emblemExamples?: string;
  /** signature-field */
  signatureField?: string;
  /** ip-infringement-checkbox */
  ipInfringementCheckbox?: string;
  /** submit-button */
  submitButton?: { label?: string; href?: string };
}
export function LogoDesignQuestionnaireForm(props: LogoDesignQuestionnaireFormProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-surface-muted-foreground text-sm uppercase tracking-wider mb-2">
          Custom
        </p>
        <h2 className="text-h2 text-surface-foreground mb-4">LogoDesignQuestionnaireForm</h2>
        <p className="text-body text-surface-secondary-foreground">
          Multi-field questionnaire form collecting business info, design preferences, target
          audience, logo style, colour preferences and signature for a logo design brief
        </p>
      </div>
    </section>
  );
}

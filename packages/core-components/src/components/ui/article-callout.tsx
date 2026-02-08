import Link from "next/link";
import { ReactNode } from "react";

type CalloutVariant = "info" | "success" | "quote" | "marketing";

interface BaseCalloutProps {
  variant: CalloutVariant;
  children?: ReactNode;
  className?: string;
}

interface InfoCalloutProps extends BaseCalloutProps {
  variant: "info";
  icon?: ReactNode;
  title: string;
  children: ReactNode;
}

interface SuccessCalloutProps extends Omit<BaseCalloutProps, "children"> {
  variant: "success";
  icon?: ReactNode;
  title: string;
  items: string[];
}

interface QuoteCalloutProps extends Omit<BaseCalloutProps, "children"> {
  variant: "quote";
  quote: string;
  author: string;
  authorTitle?: string;
  rating?: number;
}

interface MarketingCalloutProps extends Omit<BaseCalloutProps, "children"> {
  variant: "marketing";
  title: string;
  description: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  benefits?: string[];
}

type ArticleCalloutProps =
  | InfoCalloutProps
  | SuccessCalloutProps
  | QuoteCalloutProps
  | MarketingCalloutProps;

const variantStyles = {
  info: {
    container: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    titleColor: "text-blue-900",
  },
  success: {
    container: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    titleColor: "text-emerald-900",
  },
  quote: {
    container: "bg-surface-muted rounded-r-xl",
    border: "border-l-4 border-brand-primary",
  },
  marketing: {
    container: "bg-gradient-to-br from-brand-primary to-brand-primary-hover text-white shadow-lg",
  },
};

function DefaultIcon({ variant }: { variant: "info" | "success" }) {
  if (variant === "info") {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    );
  }

  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ArticleCallout(props: ArticleCalloutProps) {
  const { variant, className = "" } = props;

  if (variant === "info") {
    const { icon, title, children } = props as InfoCalloutProps;
    const styles = variantStyles.info;

    return (
      <div className={`border rounded-xl p-5 my-8 ${styles.container} ${className}`}>
        <div className="flex gap-4">
          <div className={`flex-shrink-0 ${styles.iconColor}`}>
            {icon || <DefaultIcon variant="info" />}
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold mb-3 ${styles.titleColor}`}>{title}</h4>
            <div className="text-sm text-gray-700">{children}</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "success") {
    const { icon, title, items } = props as SuccessCalloutProps;
    const styles = variantStyles.success;

    return (
      <div className={`border rounded-xl p-5 my-8 ${styles.container} ${className}`}>
        <div className="flex gap-4">
          <div className={`flex-shrink-0 ${styles.iconColor}`}>
            {icon || <DefaultIcon variant="success" />}
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold mb-3 ${styles.titleColor}`}>{title}</h4>
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className={styles.iconColor}>
                    <CheckIcon />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "quote") {
    const { quote, author, authorTitle, rating } = props as QuoteCalloutProps;
    const styles = variantStyles.quote;

    return (
      <blockquote className={`my-8 p-6 ${styles.border} ${styles.container} ${className}`}>
        {rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-200"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}
        <div className="text-gray-800 text-lg italic leading-relaxed mb-4">
          &ldquo;{quote}&rdquo;
        </div>
        <footer className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-semibold">
            {author.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{author}</p>
            {authorTitle && <p className="text-sm text-gray-600">{authorTitle}</p>}
          </div>
        </footer>
      </blockquote>
    );
  }

  if (variant === "marketing") {
    const { title, description, primaryAction, secondaryAction, benefits } =
      props as MarketingCalloutProps;
    const styles = variantStyles.marketing;

    return (
      <div className={`rounded-2xl p-6 my-8 ${styles.container} ${className}`}>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-sm text-white/90 mb-4 leading-relaxed">{description}</p>

        {benefits && benefits.length > 0 && (
          <ul className="space-y-2 mb-4">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-white mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-3">
          {primaryAction && (
            <Link
              href={primaryAction.href}
              className="block w-full bg-white text-brand-primary text-center font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {primaryAction.label}
            </Link>
          )}
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="block w-full bg-white/10 text-white text-center font-semibold py-3 px-4 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </div>
    );
  }

  return null;
}

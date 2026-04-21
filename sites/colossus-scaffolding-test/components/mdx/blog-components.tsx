import React from "react";
import Image from "next/image";

// InfoBox - Callout/highlight box for important information
export interface InfoBoxProps {
  type?: "info" | "tip" | "warning" | "success";
  title?: string;
  children: React.ReactNode;
}
export const InfoBox: React.FC<InfoBoxProps> = ({ type = "info", title, children }) => {
  const styles = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      title: "text-blue-900",
    },
    tip: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      title: "text-green-900",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
      title: "text-amber-900",
    },
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-600",
      title: "text-emerald-900",
    },
  };

  const icons = {
    info: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    tip: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    ),
    warning: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    ),
    success: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  };

  const s = styles[type];

  return (
    <div className={`${s.bg} ${s.border} border rounded-xl p-5 my-8`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <svg
            className={`w-6 h-6 ${s.icon}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {icons[type]}
          </svg>
        </div>
        <div className="flex-1">
          {title && <h4 className={`font-semibold ${s.title} mb-2`}>{title}</h4>}
          <div className="text-surface-secondary text-base leading-relaxed [&>p]:my-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// FeatureCard - Individual feature/scaffold type card
export interface FeatureCardProps {
  title: string;
  icon?: "scaffold" | "home" | "building" | "factory" | "heritage" | "mobile" | "suspended";
  children: React.ReactNode;
}
export const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon = "scaffold", children }) => {
  const icons: Record<string, React.ReactNode> = {
    scaffold: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    ),
    home: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    ),
    building: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    ),
    factory: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      />
    ),
    heritage: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
      />
    ),
    mobile: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    ),
    suspended: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    ),
  };

  return (
    <div className="bg-surface-card rounded-xl border border-surface-subtle p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
          <svg
            className="w-6 h-6 text-brand-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {icons[icon] || icons.scaffold}
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-surface-foreground mb-2">{title}</h4>
          <div className="text-surface-secondary text-base leading-relaxed [&>p]:my-0 [&>ul]:my-2 [&>ul]:space-y-1 [&_li]:p-0 [&_li]:bg-transparent [&_li]:text-base">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// FeatureGrid - Container for FeatureCards
export interface FeatureGridProps {
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
}
export const FeatureGrid: React.FC<FeatureGridProps> = ({ columns = 2, children }) => {
  const colClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return <div className={`grid ${colClass[columns]} gap-6 my-8`}>{children}</div>;
};

// ComparisonRow - data holder for comparison table row
export interface ComparisonRowProps {
  label: string;
  children: React.ReactNode;
}
export const ComparisonRow: React.FC<ComparisonRowProps> = () => null;

// ComparisonTable - For comparing options
export interface ComparisonTableProps {
  headers: string[];
  children: React.ReactNode;
}
export const ComparisonTable: React.FC<ComparisonTableProps> = ({ headers, children }) => {
  const rows = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<ComparisonRowProps> =>
        React.isValidElement(child) && child.type === ComparisonRow
    )
    .map((child) => ({
      label: child.props.label,
      content: child.props.children,
    }));

  return (
    <div className="overflow-x-auto my-8">
      <table className="w-full border-collapse bg-surface-card rounded-xl overflow-hidden shadow-sm border border-surface-subtle">
        <thead>
          <tr className="bg-surface-subtle">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left text-base font-semibold text-surface-foreground border-b border-surface-subtle"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-surface-card" : "bg-surface-subtle"}>
              <td className="px-4 py-3 text-base font-medium text-surface-foreground border-b border-surface-subtle">
                {row.label}
              </td>
              <td className="px-4 py-3 text-base text-surface-secondary border-b border-surface-subtle">
                {row.content}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// CheckList - Styled checklist for best suited/advantages
export interface CheckListProps {
  title?: string;
  type?: "check" | "bullet" | "number";
  children: React.ReactNode;
}
export const CheckList: React.FC<CheckListProps> = ({ title, type = "check", children }) => {
  return (
    <div className="my-4">
      {title && <p className="font-semibold text-surface-foreground mb-3">{title}</p>}
      <ul className="space-y-2">
        {React.Children.map(children, (child, idx) => {
          if (!React.isValidElement(child)) return null;
          const childProps = child.props as { children?: React.ReactNode };
          return (
            <li key={idx} className="flex items-start gap-3 text-surface-secondary">
              {/* eslint-disable platform/no-hardcoded-tailwind-colors -- Intentional: success/check icon color */}
              {type === "check" && (
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {/* eslint-enable platform/no-hardcoded-tailwind-colors */}
              {type === "bullet" && (
                <span className="w-2 h-2 bg-brand-primary rounded-full flex-shrink-0 mt-2" />
              )}
              {type === "number" && (
                <span className="w-6 h-6 bg-brand-primary text-white text-base font-semibold rounded-full flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
              )}
              <span>{childProps.children}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// QuoteBlock - Highlighted quote/callout
export interface QuoteBlockProps {
  author?: string;
  role?: string;
  children: React.ReactNode;
}
export const QuoteBlock: React.FC<QuoteBlockProps> = ({ author, role, children }) => {
  return (
    <blockquote className="my-8 border-l-4 border-brand-primary bg-surface-subtle rounded-r-xl p-6">
      <div className="text-surface-foreground text-base italic leading-relaxed mb-4">
        {children}
      </div>
      {author && (
        <footer className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-semibold">
            {author.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-surface-foreground">{author}</p>
            {role && <p className="text-base text-surface-tertiary">{role}</p>}
          </div>
        </footer>
      )}
    </blockquote>
  );
};

// ImageWithCaption - Blog image with caption
export interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}
export const ImageWithCaption: React.FC<ImageWithCaptionProps> = ({
  src,
  alt,
  caption,
  width = 800,
  height = 500,
}) => {
  return (
    <figure className="my-8">
      <div className="relative rounded-xl overflow-hidden shadow-md">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-base text-surface-tertiary text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

// Step - data holder for StepByStep steps
export interface StepProps {
  title: string;
  children: React.ReactNode;
}
export const Step: React.FC<StepProps> = () => null;

// StepByStep - Numbered steps for processes
export interface StepByStepProps {
  title?: string;
  children: React.ReactNode;
}
export const StepByStep: React.FC<StepByStepProps> = ({ title, children }) => {
  const steps = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<StepProps> =>
        React.isValidElement(child) && child.type === Step
    )
    .map((child) => ({
      title: child.props.title,
      content: child.props.children,
    }));

  return (
    <div className="my-8">
      {title && <h3 className="text-lg font-bold text-surface-foreground mb-6">{title}</h3>}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold text-base">
                {idx + 1}
              </div>
            </div>
            <div className="flex-1 pb-4 border-b border-surface-subtle last:border-0">
              <h4 className="font-semibold text-surface-foreground mb-2">{step.title}</h4>
              <div className="text-surface-secondary text-base leading-relaxed [&>p]:my-0">
                {step.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

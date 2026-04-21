import React from "react";
import { ContentCard } from "@platform/core-components";

// ServiceLink - data holder for service card props
export interface ServiceLinkProps {
  href: string;
  title: string;
  description: string;
  image?: string;
}
export const ServiceLink: React.FC<ServiceLinkProps> = () => null;

// RelatedServices - renders ContentCard grid from ServiceLink children
export interface RelatedServicesProps {
  title?: string;
  children: React.ReactNode;
}
export const RelatedServices: React.FC<RelatedServicesProps> = ({ title, children }) => {
  const services = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<ServiceLinkProps> =>
        React.isValidElement(child) && child.type === ServiceLink
    )
    .map((child) => child.props);

  return (
    <section className="section-standard bg-surface-card">
      <div className="container-standard">
        {title && (
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-foreground mb-6">{title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <ContentCard
              key={idx}
              title={service.title}
              description={service.description}
              href={service.href}
              image={service.image}
              contentType="services"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

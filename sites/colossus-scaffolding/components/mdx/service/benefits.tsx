import React from "react";
import { ServiceBenefits } from "@platform/core-components";

// BenefitItem - data holder for benefit text
export interface BenefitItemProps {
  children: string;
}
export const BenefitItem: React.FC<BenefitItemProps> = () => null;

// Benefits - renders ServiceBenefits component from BenefitItem children
export interface BenefitsProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}
export const Benefits: React.FC<BenefitsProps> = ({ title, description, children }) => {
  const items = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<BenefitItemProps> =>
        React.isValidElement(child) && child.type === BenefitItem
    )
    .map((child) => child.props.children);

  return <ServiceBenefits items={items} title={title} description={description} />;
};

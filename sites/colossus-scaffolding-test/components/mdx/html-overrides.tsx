import React from "react";
import Link from "next/link";
import Image from "next/image";

export const MdxLink = (
  props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children?: React.ReactNode }
) => {
  const href = typeof props.href === "string" ? props.href : "";
  const isInternal = href.startsWith("/");
  if (isInternal) {
    return (
      <Link
        href={href}
        className="text-brand-primary hover:text-brand-primary-hover font-medium underline underline-offset-2 transition-colors"
      >
        {props.children}
      </Link>
    );
  }
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-primary hover:text-brand-primary-hover font-medium underline underline-offset-2 transition-colors"
    />
  );
};

export const MdxH2 = (p: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={`text-2xl sm:text-3xl font-bold text-surface-foreground mt-12 mb-6 ${p.className || ""}`}
  >
    {p.children}
  </h2>
);

export const MdxH3 = (p: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-xl font-semibold text-surface-foreground mt-8 mb-4 ${p.className || ""}`}>
    {p.children}
  </h3>
);

export const MdxP = (p: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-surface-secondary leading-relaxed my-4 ${p.className || ""}`}>{p.children}</p>
);

export const MdxUl = (p: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className={`space-y-3 my-6 ${p.className || ""}`}>{p.children}</ul>
);

export const MdxOl = (p: React.HTMLAttributes<HTMLOListElement>) => (
  <ol className={`space-y-4 my-6 ${p.className || ""}`} style={{ counterReset: "item" }}>
    {p.children}
  </ol>
);

export const MdxLi = (p: React.HTMLAttributes<HTMLLIElement>) => (
  <li className="flex items-start gap-3 p-4 bg-surface-subtle rounded-lg list-none">
    <div className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full mt-2" />
    <div className="text-surface-foreground">{p.children}</div>
  </li>
);

export const MdxStrong = (p: React.HTMLAttributes<HTMLElement>) => (
  <strong className={`font-semibold text-surface-foreground ${p.className || ""}`}>
    {p.children}
  </strong>
);

export const MdxHr = () => <hr className="my-10 border-t border-surface-subtle" />;

export const MdxImg = (p: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const { src, alt = "", width, height, className } = p;
  const w = typeof width === "number" ? width : 1200;
  const h = typeof height === "number" ? height : 800;
  return (
    <Image
      src={(src as string) || ""}
      alt={alt}
      width={w}
      height={h}
      className={`rounded-xl ${className || ""}`}
    />
  );
};

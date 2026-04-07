"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export interface NavLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "className"> {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  exact?: boolean;
}

export function NavLink({
  href,
  children,
  className = "",
  activeClassName = "",
  inactiveClassName = "",
  exact = false,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? activeClassName : inactiveClassName}`.trim()}
      aria-current={isActive ? "page" : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
}

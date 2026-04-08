import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { MobileMenu, NavLink } from "@platform/core-components";
import { CygnusLocationsDropdown } from "./LocationsDropdown";

export interface CygnusHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
}

export function CygnusHeader({
  siteName,
  phoneDisplay,
  phoneTel,
  showPhone = true,
  primaryCta,
  navigation,
  locations,
}: CygnusHeaderProps) {
  // Cygnus nav link classes — uppercase with orange active underline
  const navBase =
    "uppercase tracking-widest text-xs font-medium font-body transition-colors border-b-2 pb-1";
  const navActive = "text-brand-primary border-brand-primary";
  const navInactive = "text-surface-foreground border-transparent hover:text-brand-primary";

  // LocationsDropdown trigger matches inactive nav style (never shows active — it opens a menu, not a page)
  const dropdownBtnClass = `flex items-center gap-1 ${navBase} ${navInactive}`;

  return (
    <header className="sticky top-0 z-40 bg-surface-inverse border-b border-surface-subtle">
      <div className="mx-auto w-full lg:w-[90%] px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="relative flex-shrink-0" style={{ width: 160, height: 40 }}>
            <Image
              src="/logo.svg"
              alt={siteName}
              fill
              sizes="160px"
              priority
              className="object-contain object-left"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => {
              if (item.hasDropdown && locations.length > 0) {
                return (
                  <CygnusLocationsDropdown
                    key={item.href}
                    locations={locations}
                    label={item.label}
                    buttonClassName={dropdownBtnClass}
                  />
                );
              }
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  className={navBase}
                  activeClassName={navActive}
                  inactiveClassName={navInactive}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {showPhone && phoneDisplay && phoneTel && (
              <Link
                href={`tel:${phoneTel}`}
                className="flex items-center gap-2 text-white hover:text-brand-primary transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span className="font-semibold">{phoneDisplay}</span>
              </Link>
            )}
            <Link
              href={primaryCta.href}
              className="bg-brand-primary text-on-brand-primary px-5 py-2.5 rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors"
            >
              {primaryCta.label}
            </Link>
          </div>

          {/* Mobile Menu */}
          <MobileMenu
            phoneDisplay={phoneDisplay ?? ""}
            phoneTel={phoneTel ?? ""}
            locations={locations}
            siteName={siteName}
            navigation={navigation}
            showPhone={showPhone}
            primaryCta={primaryCta}
            variant="dark"
          />
        </div>
      </div>
    </header>
  );
}

import type React from "react";

export function CorvusHeader(props: Record<string, string>) {
  void props;
  return (
    <header className="site-header">
      {/* corvus header — extracted from reference clone */}
      <nav className="nav container">
        <a href="/" className="nav-logo">
          {props.businessName}
        </a>
      </nav>
    </header>
  );
}

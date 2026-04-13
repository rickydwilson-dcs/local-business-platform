import type React from "react";

export function CorvusHeader(props: Record<string, unknown>) {
  void props;
  return (
    <header className="site-header">
      {/* corvus header — extracted from reference clone */}
      <nav className="nav container">
        <a href="/" className="nav-logo">
          {String(props.businessName ?? "")}
        </a>
      </nav>
    </header>
  );
}

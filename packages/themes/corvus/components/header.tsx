import type React from "react";

export function CorvusHeader(props: Record<string, unknown>) {
  return (
    <header className="site-header">
      {/* corvus header — extracted from reference clone */}
      <nav className="nav container">
        <a href="/" className="nav-logo">
          {String(props.siteName ?? "")}
        </a>
      </nav>
    </header>
  );
}

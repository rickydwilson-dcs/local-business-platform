import type React from "react";

export function CorvusFooter(props: Record<string, unknown>) {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} {String(props.siteName ?? "")}
        </p>
      </div>
    </footer>
  );
}

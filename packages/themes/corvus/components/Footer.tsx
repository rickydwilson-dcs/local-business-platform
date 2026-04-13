import type React from "react";

export function CorvusFooter(props: Record<string, unknown>) {
  void props;
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} {String(props.businessName ?? "")}
        </p>
      </div>
    </footer>
  );
}

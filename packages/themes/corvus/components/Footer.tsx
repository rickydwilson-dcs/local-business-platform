import type React from "react";

export function CorvusFooter(props: Record<string, string>) {
  void props;
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} {props.businessName}
        </p>
      </div>
    </footer>
  );
}

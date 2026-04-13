export function CorvusFooter(props: Record<string, unknown>) {
  return (
    <footer className="bg-surface-inverse text-on-brand-primary py-12">
      <div className="container-standard">
        <p>
          &copy; {new Date().getFullYear()} {String(props.siteName ?? "")}
        </p>
      </div>
    </footer>
  );
}

interface CustomPageProps {
  [key: string]: unknown;
}

export function CorvusCustomPage(props: CustomPageProps) {
  void props;
  return (
    <main className="section container-standard">
      <p className="text-surface-foreground">
        Corvus custom page — awaiting generation by extract-theme --pass translate.
      </p>
    </main>
  );
}

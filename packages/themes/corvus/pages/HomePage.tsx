interface HomePageProps {
  [key: string]: unknown;
}

export function CorvusHomePage(props: HomePageProps) {
  void props;
  return (
    <main className="section container-standard">
      <p className="text-surface-foreground">
        Corvus home page — awaiting generation by extract-theme --pass translate.
      </p>
    </main>
  );
}

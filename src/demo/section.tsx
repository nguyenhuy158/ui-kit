import type { ReactNode } from "react";

export function Anchor({ id }: { id: string }) {
  return <span id={id} className="absolute scroll-mt-24" />;
}

export function Section({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

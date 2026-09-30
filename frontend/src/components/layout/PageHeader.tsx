import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h1 className="editorial text-4xl sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

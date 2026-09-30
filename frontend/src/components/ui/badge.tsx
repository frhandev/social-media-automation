import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-border bg-secondary text-foreground",
        outline: "border-border bg-card text-muted-foreground",
        ink: "border-ink bg-ink text-ink-foreground",
        brand: "border-ink bg-brand text-brand-foreground",
        success: "border-success/30 bg-success/12 text-success",
        warning: "border-warning/40 bg-warning/15 text-foreground",
        destructive: "border-destructive/30 bg-destructive/12 text-destructive",
        info: "border-brand-2/30 bg-brand-2/10 text-brand-2",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  return <Comp className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

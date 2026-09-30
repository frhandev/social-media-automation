import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        /* Neo-brutalist accent — reserved for the single strongest action on a screen */
        brutal:
          "bg-brand text-brand-foreground border-2 border-ink rounded-md font-semibold uppercase tracking-wide shadow-brutal hover:-translate-x-px hover:-translate-y-px hover:shadow-[6px_6px_0_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs",
        brutalDark:
          "bg-ink text-ink-foreground border-2 border-ink rounded-md font-semibold uppercase tracking-wide shadow-brutal-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-xs",
        outline: "border border-border bg-card hover:bg-secondary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost: "hover:bg-secondary",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-foreground underline-offset-4 underline hover:text-brand-2",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-sm",
        icon: "size-10",
        iconSm: "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export { Button, buttonVariants };

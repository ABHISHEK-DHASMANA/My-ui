import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        superDream:
          "bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/30 hover:bg-[#7c3aed]/15",
        dream:
          "bg-[#2563eb]/10 text-[#2563eb] border-[#2563eb]/30 hover:bg-[#2563eb]/15",
        standard:
          "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/30 hover:bg-[#16a34a]/15",
        regular:
          "bg-[#d97706]/10 text-[#d97706] border-[#d97706]/30 hover:bg-[#d97706]/15",
        cu: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30",
        ap: "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30",
        as: "bg-[#eab308]/10 text-[#a16207] border-[#eab308]/30",
        ev: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30",
        cr: "bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30",
        newGlow: "bg-blue-50 text-blue-700 border-blue-300 animate-glow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

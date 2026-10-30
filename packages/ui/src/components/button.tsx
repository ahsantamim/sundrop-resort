import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "relative isolate inline-flex shrink-0 items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full font-bold tracking-[0.01em] transition-[transform,box-shadow,color,border-color] duration-300 before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-gradient-to-r before:from-coral before:to-marigold before:transition-transform before:duration-300 hover:before:scale-x-100 hover:text-ink hover:shadow-[0_14px_30px_-10px_rgba(232,106,74,.55)] active:scale-[.96] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-coral disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[18px]",
  {
    variants: {
      variant: {
        primary: "bg-teal-900 text-white",
        accent: "bg-marigold text-ink",
        ghost: "border-[1.5px] border-teal-900 bg-transparent text-teal-900 before:rounded-full hover:border-transparent",
        ghostLight: "border-[1.5px] border-white/65 bg-transparent text-white hover:border-transparent",
        gold: "bg-gold text-navy before:from-gold-300 before:to-[#F6E3A6]",
        goldGhost:
          "border-[1.5px] border-gold/70 bg-transparent text-gold-300 before:from-gold before:to-gold-300 hover:border-transparent hover:text-navy",
        quiet: "bg-white text-teal-900 shadow-none before:hidden hover:text-teal-700 hover:shadow-none",
      },
      size: {
        default: "h-[54px] px-7 text-[15px]",
        sm: "h-11 px-[22px] text-sm",
        lg: "h-[68px] px-8 text-[15px]",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };

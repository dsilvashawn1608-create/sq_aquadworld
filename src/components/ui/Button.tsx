import Link from "next/link";
import type { ReactNode } from "react";
import MagneticButton from "@/components/motion/MagneticButton";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "glass";
  size?: "md" | "sm";
  magnetic?: boolean;
  className?: string;
  ariaLabel?: string;
  pending?: string;
};

const isExternal = (href: string) => /^(https?:|tel:|mailto:)/.test(href);

export default function Button({ href, children, variant = "primary", size = "md", magnetic = false, className, ariaLabel, pending }: Props) {
  const cls = cn("btn", variant === "primary" ? "btn-primary" : "btn-glass", size === "sm" && "btn-sm", className);
  const dataPending = pending ? { "data-pending": pending, title: `${pending} not supplied yet, links to the enquiry form for now` } : {};

  const el = isExternal(href) ? (
    <a
      href={href}
      className={cls}
      aria-label={ariaLabel}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...dataPending}
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={cls} aria-label={ariaLabel} {...dataPending}>
      {children}
    </Link>
  );

  return magnetic ? <MagneticButton>{el}</MagneticButton> : el;
}

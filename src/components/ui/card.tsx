import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

// Base card is neutral; each page decides its own look via className.
export function Card({ className = "", ...props }: CardProps) {
  return <div className={`rounded-xl ${className}`} {...props} />;
}
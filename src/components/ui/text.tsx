import { cn } from "@/lib/utils";

type TextSize = "sm" | "base" | "lg";
type TextVariant = "default" | "muted";

const sizeClass: Record<TextSize, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

const variantClass: Record<TextVariant, string> = {
  default: "text-gray-600",
  muted: "text-gray-400",
};

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  size?: TextSize;
  as?: "p" | "span" | "div";
  className?: string;
}

export function Text({
  children,
  variant = "default",
  size = "sm",
  as: Tag = "p",
  className,
}: TextProps) {
  return (
    <Tag
      className={cn(
        "leading-body tracking-body",
        sizeClass[size],
        variantClass[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

import { cn } from "@/lib/utils";

type SmallVariant = "default" | "label" | "muted";

const variantClass: Record<SmallVariant, string> = {
  default: "text-xs text-gray-500",
  muted: "text-xs text-gray-400",
  label: "text-xs text-gray-400 uppercase tracking-wide",
};

interface SmallProps {
  children: React.ReactNode;
  variant?: SmallVariant;
  as?: "span" | "time" | "label" | "p";
  className?: string;
}

export function Small({
  children,
  variant = "default",
  as: Tag = "span",
  className,
}: SmallProps) {
  return (
    <Tag className={cn("leading-body", variantClass[variant], className)}>
      {children}
    </Tag>
  );
}

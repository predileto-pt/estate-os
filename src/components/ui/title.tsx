import { cn } from "@/lib/utils";

type TitleLevel = 1 | 2 | 3 | 4 | 5;
type TitleSize = "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

const sizeClass: Record<TitleSize, string> = {
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
};

const defaultSizeForLevel: Record<TitleLevel, TitleSize> = {
  1: "4xl",
  2: "3xl",
  3: "2xl",
  4: "xl",
  5: "lg",
};

interface TitleProps {
  children: React.ReactNode;
  level?: TitleLevel;
  size?: TitleSize;
  className?: string;
}

export function Title({
  children,
  level = 2,
  size,
  className,
}: TitleProps) {
  const Tag = (`h${level}` as unknown) as keyof React.JSX.IntrinsicElements;
  const resolved = size ?? defaultSizeForLevel[level];
  return (
    <Tag
      className={cn(
        "font-heading font-bold tracking-heading leading-heading text-gray-900",
        sizeClass[resolved],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

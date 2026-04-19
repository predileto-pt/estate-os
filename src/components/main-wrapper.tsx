import { cn } from "@/lib/utils";

export function MainWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-4 py-4 lg:px-6", className)}>
      {children}
    </div>
  );
}

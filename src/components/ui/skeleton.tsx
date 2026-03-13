import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  "data-testid"?: string;
}

export function Skeleton({ className, "data-testid": testId }: SkeletonProps) {
  return (
    <span
      data-testid={testId}
      className={cn(
        "inline-block h-3.5 w-24 rounded bg-gray-200 align-middle animate-pulse",
        className,
      )}
    />
  );
}

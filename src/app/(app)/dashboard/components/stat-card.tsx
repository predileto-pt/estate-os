import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  tone = "default",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
  tone?: "default" | "muted" | "accent";
}) {
  const body = (
    <div
      className={cn(
        "border border-gray-200 bg-white p-4 transition-colors",
        href && "hover:border-gray-400 cursor-pointer",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-gray-400">
          {label}
        </span>
        <Icon
          className={cn(
            "size-4",
            tone === "accent" ? "text-green-600" : "text-gray-400",
          )}
        />
      </div>
      <div
        className={cn(
          "mt-2 font-heading text-2xl font-bold",
          tone === "muted" ? "text-gray-400" : "text-gray-900",
        )}
      >
        {value}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{body}</Link>;
  }
  return body;
}

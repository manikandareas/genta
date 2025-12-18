import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

interface SpinnerProps {
  className?: string;
  /** Size variant */
  size?: "xs" | "sm" | "default" | "lg";
}

const sizeClasses = {
  xs: "size-3",
  sm: "size-3.5",
  default: "size-4",
  lg: "size-5",
};

function Spinner({ className, size = "default" }: SpinnerProps) {
  return (
    <HugeiconsIcon
      icon={Loading03Icon}
      strokeWidth={2}
      role="status"
      aria-label="Loading"
      className={cn("animate-spin", sizeClasses[size], className)}
    />
  );
}

export { Spinner };

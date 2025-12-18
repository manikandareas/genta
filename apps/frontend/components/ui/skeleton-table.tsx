"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

interface SkeletonTableProps {
  className?: string;
  /** Number of columns */
  columns?: number;
  /** Number of rows */
  rows?: number;
  /** Show table header */
  showHeader?: boolean;
}

/**
 * Skeleton loader for table components
 * Matches the layout of data tables
 */
function SkeletonTable({
  className,
  columns = 4,
  rows = 5,
  showHeader = true,
}: SkeletonTableProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-lg border", className)}>
      <Table>
        {showHeader && (
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className={cn("h-4", colIndex === 0 ? "w-32" : "w-16")} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface SkeletonTableRowProps {
  columns?: number;
}

/**
 * Single skeleton table row for incremental loading
 */
function SkeletonTableRow({ columns = 4 }: SkeletonTableRowProps) {
  return (
    <TableRow>
      {Array.from({ length: columns }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className={cn("h-4", i === 0 ? "w-32" : "w-16")} />
        </TableCell>
      ))}
    </TableRow>
  );
}

export { SkeletonTable, SkeletonTableRow };

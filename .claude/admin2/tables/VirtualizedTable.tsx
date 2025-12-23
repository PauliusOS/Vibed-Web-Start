"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { motion } from "motion/react";

interface VirtualizedTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  height?: number;
  rowHeight?: number;
  overscan?: number;
  onRowClick?: (row: TData) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function VirtualizedTable<TData>({
  data,
  columns,
  height = 600,
  rowHeight = 60,
  overscan = 5,
  onRowClick,
  loading = false,
  emptyMessage = "No results found",
  className = "",
}: VirtualizedTableProps<TData>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  if (loading) {
    return (
      <div
        className={`rounded-lg border border-white/[0.06] bg-white/[0.02] ${className}`}
        style={{ height }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-white/60">Loading...</div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={`rounded-lg border border-white/[0.06] bg-white/[0.02] ${className}`}
        style={{ height }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-white/60">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden ${className}`}>
      {/* Fixed Header */}
      <div className="border-b border-white/[0.06] bg-white/[0.02]">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-sm font-semibold text-white/80"
                  style={{
                    width: column.size
                      ? `${column.size}px`
                      : `${100 / columns.length}%`,
                  }}
                >
                  {typeof column.header === "function"
                    ? column.header({} as any)
                    : column.header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Virtualized Body */}
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ height: height - 48 }} // Subtract header height
      >
        <table className="w-full table-fixed">
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}

            {virtualRows.map((virtualRow) => {
              const row = data[virtualRow.index];
              return (
                <motion.tr
                  key={virtualRow.index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-white/[0.06] ${
                    onRowClick
                      ? "cursor-pointer hover:bg-white/[0.04] transition-colors"
                      : ""
                  }`}
                  style={{ height: `${rowHeight}px` }}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-3 text-sm text-white/80"
                      style={{
                        width: column.size
                          ? `${column.size}px`
                          : `${100 / columns.length}%`,
                      }}
                    >
                      {column.cell
                        ? typeof column.cell === "function"
                          ? column.cell({
                              row: { original: row },
                              getValue: () =>
                                row[column.accessorKey as keyof TData],
                            } as any)
                          : column.cell
                        : String(row[column.accessorKey as keyof TData] ?? "")}
                    </td>
                  ))}
                </motion.tr>
              );
            })}

            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="border-t border-white/[0.06] bg-white/[0.02] px-4 py-2">
        <div className="text-xs text-white/60">
          Showing {virtualRows.length > 0 ? virtualRows[0].index + 1 : 0} to{" "}
          {virtualRows.length > 0
            ? virtualRows[virtualRows.length - 1].index + 1
            : 0}{" "}
          of {data.length} rows (virtualized)
        </div>
      </div>
    </div>
  );
}

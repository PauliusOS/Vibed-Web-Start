"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface RosterFooterProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function RosterFooter({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: RosterFooterProps) {
  const startItem = page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, total);

  const canGoPrevious = page > 0;
  const canGoNext = page < totalPages - 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-white">
          {startItem}-{endItem}
        </span>{" "}
        of <span className="font-medium text-white">{total}</span> creators
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Items Per Page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Items per page</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
              onPageChange(0); // Reset to first page
            }}
          >
            <SelectTrigger className="w-[70px] bg-[#0A0A0A] border-[#3a3a3a] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#3a3a3a]">
              <SelectItem value="10" className="text-white hover:bg-[#2a2a2a]">
                10
              </SelectItem>
              <SelectItem value="20" className="text-white hover:bg-[#2a2a2a]">
                20
              </SelectItem>
              <SelectItem value="50" className="text-white hover:bg-[#2a2a2a]">
                50
              </SelectItem>
              <SelectItem value="100" className="text-white hover:bg-[#2a2a2a]">
                100
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(0)}
            disabled={!canGoPrevious}
            className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#2a2a2a] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">First page</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!canGoPrevious}
            className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#2a2a2a] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          <div className="flex items-center gap-1 mx-2">
            <span className="text-sm font-medium text-white">
              Page {page + 1} of {totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!canGoNext}
            className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#2a2a2a] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={!canGoNext}
            className="bg-transparent border-[#3a3a3a] text-white hover:bg-[#2a2a2a] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}


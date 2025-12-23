import { Search } from "lucide-react";

interface VideoNoResultsProps {
  onClearFilters?: () => void;
  searchTerm?: string;
  className?: string;
}

export function VideoNoResults({ onClearFilters, searchTerm, className = "" }: VideoNoResultsProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-white/[0.04] flex items-center justify-center mb-4">
        <Search className="h-7 w-7 text-white/40" />
      </div>

      {/* Heading */}
      <h3 className="text-lg font-semibold text-white mb-2">
        No videos found
      </h3>

      {/* Description */}
      <p className="text-sm text-white/60 mb-4 max-w-sm">
        {searchTerm
          ? `No results for "${searchTerm}". Try adjusting your search or filters.`
          : "Try adjusting your filters or search term to find what you're looking for."}
      </p>

      {/* Action */}
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

"use client";

type TransactionType = "income" | "expense";

interface TransactionTypeBadgeProps {
  type: TransactionType;
  className?: string;
}

const typeStyles: Record<TransactionType, string> = {
  income: "bg-emerald-500/20 text-emerald-400",
  expense: "bg-red-500/20 text-red-400",
};

const typeLabels: Record<TransactionType, string> = {
  income: "Income",
  expense: "Expense",
};

export function TransactionTypeBadge({ type, className = "" }: TransactionTypeBadgeProps) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${typeStyles[type]} ${className}`}
    >
      {typeLabels[type]}
    </span>
  );
}

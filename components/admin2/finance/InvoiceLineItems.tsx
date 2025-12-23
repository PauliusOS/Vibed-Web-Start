"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceLineItemsProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

export function InvoiceLineItems({ items, onChange }: InvoiceLineItemsProps) {
  const addItem = () => {
    onChange([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === "description") {
      item.description = value as string;
    } else if (field === "quantity") {
      item.quantity = Number(value) || 0;
      item.amount = item.quantity * item.rate;
    } else if (field === "rate") {
      item.rate = Number(value) || 0;
      item.amount = item.quantity * item.rate;
    }

    newItems[index] = item;
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 text-sm text-white/60 font-medium">
        <div className="col-span-5">Description</div>
        <div className="col-span-2 text-right">Qty</div>
        <div className="col-span-2 text-right">Rate</div>
        <div className="col-span-2 text-right">Amount</div>
        <div className="col-span-1"></div>
      </div>

      {/* Items */}
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-5">
            <Input
              type="text"
              placeholder="Item description"
              value={item.description}
              onChange={(e) => updateItem(index, "description", e.target.value)}
              className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", e.target.value)}
              className="bg-white/[0.02] border-white/[0.06] text-white text-right"
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={item.rate || ""}
              onChange={(e) => updateItem(index, "rate", e.target.value)}
              className="bg-white/[0.02] border-white/[0.06] text-white text-right"
            />
          </div>
          <div className="col-span-2 text-right">
            <span className="text-white font-medium">
              ${(item.amount / 100).toFixed(2)}
            </span>
          </div>
          <div className="col-span-1">
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}

      {/* Add Item Button */}
      <Button
        type="button"
        variant="ghost"
        onClick={addItem}
        className="text-emerald-400 hover:text-emerald-300"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Line Item
      </Button>
    </div>
  );
}

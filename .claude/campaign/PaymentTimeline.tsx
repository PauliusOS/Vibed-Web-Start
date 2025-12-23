"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Payment {
  _id: string;
  creatorId: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  dueDate: number;
  paidAt?: number;
  displayDate: number;
  type: "completed" | "scheduled";
}

interface PaymentTimelineProps {
  payments: Payment[];
}

export function PaymentTimeline({ payments }: PaymentTimelineProps) {
  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusVariant = (
    status: Payment["status"]
  ): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
    }
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Payment Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No payments yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  payment.status === "paid"
                    ? "border-green-500/20 bg-green-500/5"
                    : payment.status === "pending"
                      ? "border-yellow-500/20 bg-yellow-500/5"
                      : "border-red-500/20 bg-red-500/5"
                )}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(payment.status)}
                  <div>
                    <p className="text-sm font-medium">{payment.creatorId}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.displayDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    ${payment.amount.toLocaleString()}
                  </p>
                  <Badge variant={getStatusVariant(payment.status)} className="text-xs">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

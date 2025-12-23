"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@/lib/contexts/OrganizationContext";
import { useToast } from "@/lib/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWizard } from "@/lib/hooks/useWizard";
import {
  FileText,
  Check,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Plus,
  X,
  Calendar,
  Building2,
  Mail,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  // Step 1: Client Selection
  clientId: string;
  clientName: string;
  clientEmail: string;

  // Step 2: Line Items
  lineItems: LineItem[];
  notes?: string;

  // Step 3: Terms
  dueDate: string;
  paymentTerms: string;
  taxRate: number;
  discount: number;

  // Step 4: Review
  sendEmail: boolean;
}

interface InvoiceCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Array<{ _id: string; companyName: string; email: string }>;
  onInvoiceCreated?: () => void;
}

export function InvoiceCreationWizard({
  open,
  onOpenChange,
  clients,
  onInvoiceCreated,
}: InvoiceCreationWizardProps) {
  const { selectedOrganizationId } = useOrganization();
  const { toast } = useToast();
  const createInvoice = useMutation(api.finance2.createInvoiceFromWizard);

  const wizardSteps = [
    { id: "client", title: "Select Client", description: "Choose the client for this invoice" },
    { id: "items", title: "Line Items", description: "Add invoice line items" },
    { id: "terms", title: "Payment Terms", description: "Set due date and terms" },
    { id: "review", title: "Review & Send", description: "Review and send invoice" },
  ];

  const wizard = useWizard(wizardSteps, {
    clientId: "",
    clientName: "",
    clientEmail: "",
    lineItems: [] as LineItem[],
    notes: "",
    dueDate: "",
    paymentTerms: "net30",
    taxRate: 0,
    discount: 0,
    sendEmail: true,
  });

  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Line item management
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    wizard.updateData({
      lineItems: [...wizard.data.lineItems, newItem],
    });
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    const updatedItems = wizard.data.lineItems.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "rate") {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    });
    wizard.updateData({ lineItems: updatedItems });
  };

  const removeLineItem = (id: string) => {
    wizard.updateData({
      lineItems: wizard.data.lineItems.filter((item) => item.id !== id),
    });
  };

  // Calculate totals
  const subtotal = wizard.data.lineItems.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = (subtotal * wizard.data.discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * wizard.data.taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const handleCreate = async () => {
    if (!selectedOrganizationId) return;

    setIsCreating(true);
    setCreateSuccess(false);

    try {
      const invoiceId = await createInvoice({
        organizationId: selectedOrganizationId,
        clientId: wizard.data.clientId as any,
        lineItems: wizard.data.lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        })),
        notes: wizard.data.notes,
        dueDate: new Date(wizard.data.dueDate).getTime(),
        paymentTerms: wizard.data.paymentTerms,
        taxRate: wizard.data.taxRate,
        discount: wizard.data.discount,
        sendEmail: wizard.data.sendEmail,
      });

      toast({
        title: "Invoice created",
        description: `Invoice for ${wizard.data.clientName} has been created.`,
      });

      setCreateSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
        setCreateSuccess(false);
        if (onInvoiceCreated) {
          onInvoiceCreated();
        }
      }, 1500);
    } catch (error) {
      console.error("Failed to create invoice:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <DialogTitle>Create Invoice</DialogTitle>
              <DialogDescription className="mt-1">
                Step {wizard.currentStep + 1} of {wizardSteps.length}:{" "}
                {wizard.currentStepData.title}
              </DialogDescription>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {wizardSteps.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center gap-2">
                <div
                  className={`flex-1 h-1 rounded-full ${
                    index <= wizard.currentStep
                      ? "bg-green-500"
                      : "bg-white/[0.1]"
                  }`}
                />
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <AnimatePresence mode="wait">
            {/* Step 1: Client Selection */}
            {wizard.currentStep === 0 && (
              <motion.div
                key="client"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="client" className="text-white/80">
                    Select Client *
                  </Label>
                  <Select
                    value={wizard.data.clientId}
                    onValueChange={(value) => {
                      const client = clients.find((c) => c._id === value);
                      wizard.updateData({
                        clientId: value,
                        clientName: client?.companyName || "",
                        clientEmail: client?.email || "",
                      });
                    }}
                  >
                    <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client._id} value={client._id}>
                          {client.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {wizard.data.clientId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {wizard.data.clientName}
                        </p>
                        <div className="flex items-center gap-1 text-white/60 text-sm">
                          <Mail className="w-3 h-3" />
                          <span>{wizard.data.clientEmail}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Line Items */}
            {wizard.currentStep === 1 && (
              <motion.div
                key="items"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-white/80">Line Items</Label>
                  <Button
                    onClick={addLineItem}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {wizard.data.lineItems.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/[0.1] rounded-lg">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-white/20" />
                      <p className="text-white/60 text-sm mb-4">
                        No line items added yet
                      </p>
                      <Button onClick={addLineItem} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Item
                      </Button>
                    </div>
                  ) : (
                    wizard.data.lineItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 grid grid-cols-4 gap-3">
                            <div className="col-span-2">
                              <Label className="text-white/60 text-xs mb-2">
                                Description
                              </Label>
                              <Input
                                value={item.description}
                                onChange={(e) =>
                                  updateLineItem(item.id, "description", e.target.value)
                                }
                                placeholder="Item description"
                                className="bg-white/[0.02] border-white/[0.06] text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-white/60 text-xs mb-2">
                                Quantity
                              </Label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateLineItem(
                                    item.id,
                                    "quantity",
                                    Number(e.target.value)
                                  )
                                }
                                className="bg-white/[0.02] border-white/[0.06] text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-white/60 text-xs mb-2">Rate</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.rate}
                                onChange={(e) =>
                                  updateLineItem(
                                    item.id,
                                    "rate",
                                    Number(e.target.value)
                                  )
                                }
                                className="bg-white/[0.02] border-white/[0.06] text-white"
                              />
                            </div>
                          </div>

                          <div className="flex items-end gap-2">
                            <div className="text-right">
                              <Label className="text-white/60 text-xs mb-2 block">
                                Amount
                              </Label>
                              <p className="text-white font-semibold">
                                ${item.amount.toFixed(2)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLineItem(item.id)}
                              className="h-8 w-8 p-0 text-white/60 hover:text-red-400"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white/80">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={wizard.data.notes}
                    onChange={(e) => wizard.updateData({ notes: e.target.value })}
                    placeholder="Additional notes or terms..."
                    className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 min-h-20"
                  />
                </div>

                {wizard.data.lineItems.length > 0 && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between text-white">
                      <span className="font-medium">Subtotal:</span>
                      <span className="text-lg font-semibold">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Payment Terms */}
            {wizard.currentStep === 2 && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-white/80">
                      Due Date *
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={wizard.data.dueDate}
                      onChange={(e) => wizard.updateData({ dueDate: e.target.value })}
                      className="bg-white/[0.02] border-white/[0.06] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms" className="text-white/80">
                      Payment Terms
                    </Label>
                    <Select
                      value={wizard.data.paymentTerms}
                      onValueChange={(value) =>
                        wizard.updateData({ paymentTerms: value })
                      }
                    >
                      <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                        <SelectItem value="net15">Net 15</SelectItem>
                        <SelectItem value="net30">Net 30</SelectItem>
                        <SelectItem value="net60">Net 60</SelectItem>
                        <SelectItem value="net90">Net 90</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate" className="text-white/80">
                      Tax Rate (%)
                    </Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={wizard.data.taxRate}
                      onChange={(e) =>
                        wizard.updateData({ taxRate: Number(e.target.value) })
                      }
                      className="bg-white/[0.02] border-white/[0.06] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount" className="text-white/80">
                      Discount (%)
                    </Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={wizard.data.discount}
                      onChange={(e) =>
                        wizard.updateData({ discount: Number(e.target.value) })
                      }
                      className="bg-white/[0.02] border-white/[0.06] text-white"
                    />
                  </div>
                </div>

                {/* Calculation Summary */}
                <div className="space-y-2 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <div className="flex items-center justify-between text-white/80">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {wizard.data.discount > 0 && (
                    <div className="flex items-center justify-between text-green-400">
                      <span>Discount ({wizard.data.discount}%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {wizard.data.taxRate > 0 && (
                    <div className="flex items-center justify-between text-white/80">
                      <span>Tax ({wizard.data.taxRate}%):</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/[0.1] pt-2 mt-2">
                    <div className="flex items-center justify-between text-white font-semibold text-lg">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {wizard.currentStep === 3 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Client Info */}
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <h4 className="text-white font-medium mb-3">Client Information</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-white">{wizard.data.clientName}</p>
                    <p className="text-white/60">{wizard.data.clientEmail}</p>
                  </div>
                </div>

                {/* Line Items Summary */}
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <h4 className="text-white font-medium mb-3">
                    Line Items ({wizard.data.lineItems.length})
                  </h4>
                  <div className="space-y-2">
                    {wizard.data.lineItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-white/80">{item.description}</span>
                        <span className="text-white font-medium">
                          ${item.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <h4 className="text-white font-medium mb-3">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Due Date:</span>
                      <span className="text-white">
                        {new Date(wizard.data.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Payment Terms:</span>
                      <span className="text-white capitalize">
                        {wizard.data.paymentTerms.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-semibold text-lg pt-2 border-t border-white/[0.1]">
                      <span className="text-white">Total Amount:</span>
                      <span className="text-green-400">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Send Email Option */}
                <div
                  className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg cursor-pointer"
                  onClick={() =>
                    wizard.updateData({ sendEmail: !wizard.data.sendEmail })
                  }
                >
                  <input
                    type="checkbox"
                    checked={wizard.data.sendEmail}
                    onChange={(e) =>
                      wizard.updateData({ sendEmail: e.target.checked })
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <p className="text-white text-sm font-medium">
                        Send Invoice via Email
                      </p>
                    </div>
                    <p className="text-white/60 text-xs">
                      Email the invoice to {wizard.data.clientEmail}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              onClick={wizard.goToPrevious}
              disabled={wizard.isFirstStep || isCreating}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>

              {wizard.isLastStep ? (
                <Button
                  onClick={handleCreate}
                  disabled={
                    isCreating ||
                    !wizard.data.clientId ||
                    wizard.data.lineItems.length === 0 ||
                    !wizard.data.dueDate
                  }
                  className={`${
                    createSuccess
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white`}
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : createSuccess ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Created!
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Create Invoice
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={wizard.goToNext}
                  disabled={
                    (wizard.currentStep === 0 && !wizard.data.clientId) ||
                    (wizard.currentStep === 1 &&
                      wizard.data.lineItems.length === 0)
                  }
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

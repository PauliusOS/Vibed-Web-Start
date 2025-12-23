"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UserPlus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateTestAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTestAccountDialog({
  open,
  onOpenChange,
}: CreateTestAccountDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "creator" | "client">("creator");
  const [isCreating, setIsCreating] = useState(false);

  const createTestAccount = useAction(api.devAccounts.createTestAccount);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("creator");
  };

  const handleCreate = async () => {
    if (!firstName || !lastName || !username || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsCreating(true);
    try {
      const result = await createTestAccount({
        firstName,
        lastName,
        username,
        email,
        password,
        role,
      });

      toast.success(result.message || "Test account created successfully!");
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create test account");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create Test Account
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Create a development account with custom credentials
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-yellow-500/10 border-yellow-500/30 mb-4">
          <AlertCircle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-xs text-yellow-200">
            This creates a real Clerk account for development/testing purposes only
          </AlertDescription>
        </Alert>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/70">First Name</Label>
              <Input
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">Last Name</Label>
              <Input
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Username</Label>
            <Input
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Email</Label>
            <Input
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
            <p className="text-xs text-white/40">
              Email doesn't need to be real for testing
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Password</Label>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Role</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as "admin" | "creator" | "client")}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="creator">Creator</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-white/40">
              Role will be automatically assigned in Convex
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
            className="text-white/50 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={
              !firstName ||
              !lastName ||
              !username ||
              !email ||
              !password ||
              isCreating
            }
            className="bg-green-500 hover:bg-green-600 text-white gap-2"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            Create Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

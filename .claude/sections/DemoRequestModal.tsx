"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseStudyCompany?: string;
  caseStudyId?: string;
}

interface FormData {
  companyName: string;
  email: string;
  phone: string;
  companySize: string;
  useCase: string;
}

interface FormErrors {
  companyName?: string;
  email?: string;
  phone?: string;
  companySize?: string;
  useCase?: string;
}

export function DemoRequestModal({
  isOpen,
  onClose,
  caseStudyCompany,
  caseStudyId,
}: DemoRequestModalProps) {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    email: "",
    phone: "",
    companySize: "",
    useCase: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.companySize) {
      newErrors.companySize = "Please select company size";
    }

    if (!formData.useCase.trim()) {
      newErrors.useCase = "Please describe your use case";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Submit to Convex or backend service
      // await submitDemoRequest({ ...formData, caseStudyId });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to calendar booking
      const calendarUrl =
        process.env.NEXT_PUBLIC_CALENDAR_URL ||
        "https://calendly.com/your-team/demo";
      window.location.href = calendarUrl;
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-black/90 backdrop-blur-md p-8 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Schedule your demo
              </h2>
              {caseStudyCompany && (
                <p className="text-white/50 text-sm">
                  Interested in results like {caseStudyCompany}?
                </p>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Company Name */}
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  placeholder="Your company name"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                )}
              </div>

              {/* Company Size */}
              <div>
                <label
                  htmlFor="companySize"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  Company Size *
                </label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                >
                  <option value="" className="bg-black">
                    Select company size
                  </option>
                  <option value="1-10" className="bg-black">
                    1-10 employees
                  </option>
                  <option value="11-50" className="bg-black">
                    11-50 employees
                  </option>
                  <option value="51-200" className="bg-black">
                    51-200 employees
                  </option>
                  <option value="201-500" className="bg-black">
                    201-500 employees
                  </option>
                  <option value="500+" className="bg-black">
                    500+ employees
                  </option>
                </select>
                {errors.companySize && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.companySize}
                  </p>
                )}
              </div>

              {/* Use Case */}
              <div>
                <label
                  htmlFor="useCase"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  What are your goals? *
                </label>
                <textarea
                  id="useCase"
                  name="useCase"
                  value={formData.useCase}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
                  placeholder="Tell us about your campaign goals and how we can help..."
                />
                {errors.useCase && (
                  <p className="mt-1 text-sm text-red-400">{errors.useCase}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 px-6 rounded-full bg-cyan-400 text-black font-medium text-sm hover:bg-cyan-300 disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-400/20"
              >
                {isSubmitting ? "Scheduling..." : "Schedule Demo"}
              </button>
            </form>

            {/* Footer Text */}
            <p className="mt-4 text-xs text-white/40 text-center">
              By submitting, you agree to our terms of service and privacy
              policy.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

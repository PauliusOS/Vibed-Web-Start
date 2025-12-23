"use client";

import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, Calendar as CalendarIcon, Clock, Home } from "lucide-react";
import Link from "next/link";
import { SparklesCore } from "@/components/ui/sparkles";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

interface DemoFormSuccessProps {
  formData: {
    name: string;
    email: string;
    company: string;
    role: string;
    phone?: string;
    message?: string;
  };
}

export function DemoFormSuccess({ formData }: DemoFormSuccessProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  // Generate available time slots (9 AM - 5 PM, every hour)
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const firstName = formData.name.split(" ")[0];

  const handleBookSlot = () => {
    if (selectedDate && selectedTime) {
      // Here you would integrate with your calendar system (Calendly, Cal.com, etc.)
      console.log("Booking demo for:", {
        date: selectedDate,
        time: selectedTime,
        ...formData,
      });
      alert(`Demo booked for ${selectedDate.toLocaleDateString()} at ${selectedTime}!`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Sparkles Effect */}
      <SparklesCore className="absolute inset-0 pointer-events-none" background="transparent" />

      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-primary/20 to-green-500/20 rounded-3xl blur-xl opacity-50"></div>

        {/* Main container */}
        <div className="relative bg-gradient-to-br from-background via-background to-accent/5 border border-border rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Success Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center border border-green-400/30">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Thank You, {firstName}!
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your demo request from <span className="text-foreground font-semibold">{formData.company}</span> has been received.
              </p>
            </motion.div>
          </div>

          {/* Calendar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <div className="bg-accent/30 border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Schedule Your Demo</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Calendar */}
                <div>
                  <p className="text-sm text-muted-foreground mb-4">Select a date:</p>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date < new Date() || date.getDay() === 0 || date.getDay() === 6
                    }
                    className="rounded-xl border border-border bg-background/50"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <p className="text-sm text-muted-foreground mb-4">Choose a time:</p>
                  <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        disabled={!selectedDate}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          selectedTime === time
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : "bg-accent/50 border-border text-foreground hover:border-primary hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
                        }`}
                      >
                        <Clock className="w-4 h-4 inline mr-2" />
                        {time}
                      </button>
                    ))}
                  </div>

                  {/* Book Button */}
                  {selectedDate && selectedTime && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBookSlot}
                      className="w-full mt-4 h-12 flex items-center justify-center text-sm font-semibold tracking-wide rounded-lg bg-primary text-primary-foreground shadow-lg border border-border hover:bg-primary/90 transition-all duration-200"
                    >
                      Confirm Demo Booking
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-10"
          >
            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">What Happens Next?</h3>
              <div className="space-y-3">
                {[
                  "We'll review your request and company profile",
                  "Our team will reach out within 24 hours to confirm your demo time",
                  "Get a personalized walkthrough tailored to your marketing goals",
                  "See real campaign data and analytics in action",
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/sign-in" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto h-12 flex items-center justify-center px-8 text-sm font-semibold tracking-wide rounded-xl bg-primary text-primary-foreground shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_3px_3px_-1.5px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2)] border border-border hover:bg-primary/90 transition-all duration-200"
              >
                Sign In Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/home" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto h-12 flex items-center justify-center px-8 text-sm font-medium tracking-wide rounded-xl bg-transparent text-foreground border border-border hover:bg-accent hover:border-border transition-all duration-200"
              >
                <Home className="mr-2 w-4 h-4" />
                Return to Homepage
              </motion.button>
            </Link>
          </motion.div>

          {/* Support Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Questions? Contact us at{" "}
              <a href="mailto:demo@opa.com" className="text-primary hover:underline font-medium">
                demo@opa.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

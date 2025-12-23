'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export default function PrivacyPolicyPageV4() {
  return (
    <div className="min-h-screen bg-[#04070d]">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#04070d]/70 backdrop-blur-xl border-b border-white/[0.07]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/4" className="flex items-center">
              <div
                className="relative h-8 w-[120px]"
                style={{
                  background: 'linear-gradient(135deg, #6b7280 0%, #d5dbe6 50%, #ffffff 100%)',
                  WebkitMaskImage: 'url(/logos/sylcroad-logo.png)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'left center',
                  maskImage: 'url(/logos/sylcroad-logo.png)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'left center',
                }}
                aria-label="SylcRoad"
              />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/4#how-it-works"
                className="text-sm text-[#d5dbe6] hover:text-[#d5dbe6]/70 transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="/4#platform"
                className="text-sm text-[#d5dbe6] hover:text-[#d5dbe6]/70 transition-colors"
              >
                Platform
              </Link>
              <Link
                href="/4#why-us"
                className="text-sm text-[#d5dbe6] hover:text-[#d5dbe6]/70 transition-colors"
              >
                Why Us
              </Link>
              <Link
                href="/4#testimonials"
                className="text-sm text-[#d5dbe6] hover:text-[#d5dbe6]/70 transition-colors"
              >
                Creators
              </Link>
              <Link
                href="/4/contact"
                className="text-sm text-[#d5dbe6] hover:text-[#d5dbe6]/70 transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Log in Button */}
            <div className="flex items-center">
              <Button
                className="h-auto py-2 px-4 text-sm font-medium rounded-lg bg-[#0066FF] text-white transition-all duration-200 hover:bg-[#0055DD] cursor-pointer"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 102, 255, 0.25)'
                }}
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Privacy Policy Content */}
      <section className="relative pt-28 sm:pt-32 md:pt-40 pb-20 sm:pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10"
              style={{
                background: 'linear-gradient(145deg, #1a1f2e, #10131c)',
                boxShadow: '0 6px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
              }}
            >
              <Shield className="w-4 h-4 text-[#0066FF]" />
              <span className="text-sm font-medium text-[#d5dbe6] uppercase tracking-wider">Legal</span>
            </div>
          </motion.div>

          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6"
              style={{
                background: 'linear-gradient(135deg, #6b7280 0%, #d5dbe6 50%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Privacy Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#d5dbe6]/70 text-base"
            >
              Last updated: December 2025
            </motion.p>
          </div>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-[24px] p-6 sm:p-8 md:p-10 border border-white/[0.07]"
            style={{
              background: 'linear-gradient(145deg, #10131c, #0a0d14)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}
          >
            <div className="prose prose-lg max-w-none text-[#d5dbe6]/80">

              {/* Data Controller */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Data Controller</h2>
                <p className="leading-relaxed">
                  <strong>SylcRoad Ltd</strong><br />
                  Company Number: 16854232<br />
                  124–128 City Road, London, England, EC1V 2NX<br />
                  Email: <a href="mailto:legal@sylcroad.com" className="text-white hover:underline">legal@sylcroad.com</a>
                </p>
              </section>

              {/* What We Collect */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Information We Collect</h2>
                <p className="mb-4 leading-relaxed">We collect information necessary to provide our influencer marketing services:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Contact details:</strong> Name, email, phone number, company name</li>
                  <li><strong>Creator data:</strong> Social media handles, follower counts, engagement metrics</li>
                  <li><strong>Business information:</strong> Campaign objectives, budgets, billing details</li>
                  <li><strong>Communications:</strong> Messages and correspondence with our team</li>
                  <li><strong>Technical data:</strong> IP address, browser type, device information</li>
                </ul>
              </section>

              {/* How We Use It */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Deliver and manage influencer marketing campaigns</li>
                  <li>Match brands with suitable creators</li>
                  <li>Process payments and send invoices</li>
                  <li>Provide analytics and performance reports</li>
                  <li>Communicate about our services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* Legal Basis */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Legal Basis (UK GDPR)</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Contract:</strong> To perform services agreed with you</li>
                  <li><strong>Legitimate interests:</strong> Business operations and service improvement</li>
                  <li><strong>Legal obligation:</strong> Compliance with applicable laws</li>
                  <li><strong>Consent:</strong> Where explicitly given for specific purposes</li>
                </ul>
              </section>

              {/* Sharing */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Information Sharing</h2>
                <p className="mb-4 leading-relaxed">We share information only when necessary:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Campaign partners:</strong> Brands and creators involved in your campaigns</li>
                  <li><strong>Service providers:</strong> Hosting, analytics, and payment processing</li>
                  <li><strong>Legal requirements:</strong> When required by law or court order</li>
                </ul>
                <p className="mt-4 leading-relaxed">We do not sell your personal information.</p>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Cookies</h2>
                <p className="leading-relaxed">
                  We use essential cookies for website functionality and analytics cookies to understand usage. You can control cookie settings through your browser.
                </p>
              </section>

              {/* Security & Retention */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Security & Retention</h2>
                <p className="leading-relaxed">
                  We implement appropriate security measures to protect your data. We retain information for as long as necessary to fulfil the purposes outlined in this policy or as required by law. When no longer needed, data is securely deleted.
                </p>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Your Rights</h2>
                <p className="mb-4 leading-relaxed">Under UK GDPR, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to or restrict processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p className="mt-4 leading-relaxed">
                  To exercise these rights, contact <a href="mailto:legal@sylcroad.com" className="text-white hover:underline">legal@sylcroad.com</a>. You may also lodge a complaint with the ICO.
                </p>
              </section>

              {/* Changes */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Changes</h2>
                <p className="leading-relaxed">
                  We may update this policy from time to time. Changes will be posted on this page with an updated date.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Contact</h2>
                <p className="leading-relaxed">
                  Questions about this policy? Contact us at <a href="mailto:legal@sylcroad.com" className="text-white hover:underline">legal@sylcroad.com</a> or <a href="mailto:support@sylcroad.com" className="text-white hover:underline">support@sylcroad.com</a>.
                </p>
              </section>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom blur reveal effect */}
      <div
        className="fixed bottom-0 left-0 right-0 h-20 sm:h-24 pointer-events-none z-40 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(to top, rgba(4,7,13,0.6) 0%, rgba(4,7,13,0.3) 40%, transparent 100%)',
          maskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)'
        }}
      />
    </div>
  );
}

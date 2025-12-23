'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export default function TermsOfServicePageV4() {
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

      {/* Terms of Service Content */}
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
              <FileText className="w-4 h-4 text-[#0066FF]" />
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
              Terms of Service
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

              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Agreement</h2>
                <p className="mb-4 leading-relaxed">
                  These Terms govern your use of services provided by SylcRoad Ltd (&quot;we&quot;, &quot;us&quot;). By engaging our services, you agree to these Terms.
                </p>
                <p className="leading-relaxed">
                  <strong>SylcRoad Ltd</strong><br />
                  Company Number: 16854232<br />
                  124–128 City Road, London, England, EC1V 2NX
                </p>
              </section>

              {/* Services */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Our Services</h2>
                <p className="mb-4 leading-relaxed">SylcRoad provides B2B influencer marketing services including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Campaign strategy and planning</li>
                  <li>Creator discovery and matchmaking</li>
                  <li>Campaign management and coordination</li>
                  <li>Performance analytics and reporting</li>
                  <li>Access to our private client platform</li>
                </ul>
                <p className="mt-4 leading-relaxed">
                  Specific deliverables, timelines, and fees are defined in individual client agreements.
                </p>
              </section>

              {/* Client Obligations */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Client Obligations</h2>
                <p className="mb-4 leading-relaxed">When working with us, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate information about your business and campaign requirements</li>
                  <li>Ensure your campaigns comply with applicable advertising regulations</li>
                  <li>Make payments as outlined in your service agreement</li>
                  <li>Maintain confidentiality of sensitive business information</li>
                  <li>Not misuse our platform or services</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Intellectual Property</h2>
                <p className="mb-4 leading-relaxed">
                  Our platform, branding, and proprietary methods remain our property. Campaign content ownership and usage rights are defined in individual agreements between brands and creators.
                </p>
              </section>

              {/* Disclaimers */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Disclaimers</h2>
                <p className="mb-4 leading-relaxed">Please note:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Campaign performance depends on various factors including creator execution, market conditions, and audience behaviour</li>
                  <li>Analytics are based on data from third-party platforms (Instagram, TikTok, YouTube, etc.) and may not be 100% accurate</li>
                  <li>We are not liable for changes to third-party platform algorithms, policies, or APIs</li>
                  <li>Past campaign results do not guarantee future performance</li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Limitation of Liability</h2>
                <p className="mb-4 leading-relaxed">
                  To the maximum extent permitted by law, our liability is limited to the fees paid for the specific service in question. We are not liable for indirect, incidental, or consequential damages.
                </p>
                <p className="leading-relaxed">
                  Nothing in these Terms excludes liability for death, personal injury caused by negligence, or fraud.
                </p>
              </section>

              {/* Confidentiality */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Confidentiality</h2>
                <p className="leading-relaxed">
                  Both parties agree to keep confidential any sensitive business information shared during our engagement. This includes campaign details, pricing, strategies, and proprietary data.
                </p>
              </section>

              {/* Termination */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Termination</h2>
                <p className="leading-relaxed">
                  Either party may terminate services as specified in the individual service agreement. Upon termination, access to our platform ceases and outstanding payments become due.
                </p>
              </section>

              {/* Governing Law */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Governing Law</h2>
                <p className="leading-relaxed">
                  These Terms are governed by the laws of England and Wales. Disputes are subject to the exclusive jurisdiction of the courts of England and Wales. Before legal proceedings, parties agree to attempt resolution through good-faith negotiation.
                </p>
              </section>

              {/* Changes */}
              <section className="mb-8">
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Changes</h2>
                <p className="leading-relaxed">
                  We may update these Terms from time to time. Changes will be posted on this page with an updated date.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-[#d5dbe6] text-xl font-semibold mb-4">Contact</h2>
                <p className="leading-relaxed">
                  Questions about these Terms? Contact us at <a href="mailto:legal@sylcroad.com" className="text-white hover:underline">legal@sylcroad.com</a> or <a href="mailto:support@sylcroad.com" className="text-white hover:underline">support@sylcroad.com</a>.
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

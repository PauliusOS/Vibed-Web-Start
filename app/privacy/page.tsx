'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f4f4f4]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logos/sylcroad-logo.png"
                alt="SylcRoad"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/#how-it-works"
                className="text-sm text-[#16101e] hover:text-[#16101e]/70 transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="/#platform"
                className="text-sm text-[#16101e] hover:text-[#16101e]/70 transition-colors"
              >
                Platform
              </Link>
              <Link
                href="/#why-us"
                className="text-sm text-[#16101e] hover:text-[#16101e]/70 transition-colors"
              >
                Why Us
              </Link>
              <Link
                href="/#testimonials"
                className="text-sm text-[#16101e] hover:text-[#16101e]/70 transition-colors"
              >
                Creators
              </Link>
              <Link
                href="/contact"
                className="text-sm text-[#16101e] hover:text-[#16101e]/70 transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Log in Button */}
            <div className="flex items-center">
              <Button
                className="h-auto py-3 px-6 text-base font-medium rounded-xl bg-black text-white transition-shadow duration-200 hover:shadow-lg hover:bg-black"
                style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Privacy Policy Content */}
      <section className="relative pt-28 sm:pt-32 md:pt-40 pb-20 sm:pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#f4f4f4] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_2px_8px_rgba(255,255,255,0.95)]">
              <Shield className="w-4 h-4 text-[#6b6b6b]" />
              <span className="text-sm font-medium text-[#3a3a3a] uppercase tracking-wider">Legal</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-[#16101e] text-4xl sm:text-5xl md:text-6xl font-serif italic mb-4 sm:mb-6">
              Privacy Policy
            </h1>
            <p className="text-[#16101e]/70 text-base">
              Last updated: December 2025
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-[#f4f4f4] rounded-[24px] p-6 sm:p-8 md:p-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(255,255,255,0.95)]">
            <div className="prose prose-lg max-w-none text-[#16101e]/80">

              {/* Data Controller */}
              <section className="mb-8">
                <h2 className="text-[#16101e] text-xl font-semibold mb-4">Data Controller</h2>
                <p className="leading-relaxed">
                  <strong>SylcRoad Ltd</strong><br />
                  Company Number: 16854232<br />
                  124–128 City Road, London, England, EC1V 2NX<br />
                  Email: <a href="mailto:legal@sylcroad.com" className="text-[#09f] hover:underline">legal@sylcroad.com</a>
                </p>
              </section>

              {/* What We Collect */}
              <section className="mb-8">
                <h2 className="text-[#16101e] text-xl font-semibold mb-4">Information We Collect</h2>
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
                <h2 className="text-[#16101e] text-xl font-semibold mb-4">How We Use Your Information</h2>
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
                <h2 className="text-[#16101e] text-xl font-semibold mb-4">Legal Basis (UK GDPR)</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Contract:</strong> To perform services agreed with you</li>
                  <li><strong>Legitimate interests:</strong> Business operations and service improvement</li>
                  <li><strong>Legal obligation:</strong> Compliance with applicable laws</li>
                  <li><strong>Consent:</strong> Where explicitly given for specific purposes</li>
                </ul>
              </section>

              {/* Sharing */}
              <section className="mb-8">
                <h2 className="text-[#16101e] text-xl font-semibold mb-4">Information Sharing</h2>
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
                <h2 className="text-[#16101e] text-xl font-semibold mb-4">Cookies</h2>
                <p className="leading-relaxed">
                  We use essential cookies for website functionality and analytics cookies to understand usage. You can control cookie settings through your browser.
                </p>
              </section>

              {/* Security & Retention */}
              <section className="mb-8">
                <h2 className="text-[#16101e] text-xl font-semibold mb-4">Security & Retention</h2>
                <p className="leading-relaxed">
                  We implement appropriate security measures to protect your data. We retain information for as long as necessary to fulfil the purposes outlined in this policy or as required by law. When no longer needed, data is securely deleted.
                </p>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-[#16101e] text-xl font-semibold mb-4">Your Rights</h2>
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
                  To exercise these rights, contact <a href="mailto:legal@sylcroad.com" className="text-[#09f] hover:underline">legal@sylcroad.com</a>. You may also lodge a complaint with the ICO.
                </p>
              </section>

              {/* Changes */}
              <section className="mb-8">
                <h2 className="text-[#16101e] text-xl font-semibold mb-4">Changes</h2>
                <p className="leading-relaxed">
                  We may update this policy from time to time. Changes will be posted on this page with an updated date.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-[#16101e] text-xl font-semibold mb-4">Contact</h2>
                <p className="leading-relaxed">
                  Questions about this policy? Contact us at <a href="mailto:legal@sylcroad.com" className="text-[#09f] hover:underline">legal@sylcroad.com</a> or <a href="mailto:support@sylcroad.com" className="text-[#09f] hover:underline">support@sylcroad.com</a>.
                </p>
              </section>

            </div>
          </div>
        </div>
      </section>

      {/* Bottom blur reveal effect */}
      <div
        className="fixed bottom-0 left-0 right-0 h-20 sm:h-24 pointer-events-none z-40 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(to top, rgba(244,244,244,0.6) 0%, rgba(244,244,244,0.3) 40%, transparent 100%)',
          maskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)'
        }}
      />
    </div>
  );
}

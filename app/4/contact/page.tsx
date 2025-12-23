'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Users, MessageCircle, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export default function ContactPageV4() {
  const [userType, setUserType] = useState<'company' | 'creator' | null>(null);

  // Company form state
  const [companyForm, setCompanyForm] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    website: '',
    lastYearSpend: '',
    goals: '',
  });

  // Creator form state
  const [creatorForm, setCreatorForm] = useState({
    fullName: '',
    email: '',
    socialHandle: '',
    platforms: [] as string[],
    niche: '',
    stats: '',
  });


  const platformOptions = ['TikTok', 'Instagram', 'YouTube'];

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Company form submitted:', companyForm);
  };

  const handleCreatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creator form submitted:', creatorForm);
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCompanyForm({
      ...companyForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreatorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCreatorForm({
      ...creatorForm,
      [e.target.name]: e.target.value,
    });
  };

  const togglePlatform = (platform: string) => {
    setCreatorForm({
      ...creatorForm,
      platforms: creatorForm.platforms.includes(platform)
        ? creatorForm.platforms.filter((p) => p !== platform)
        : [...creatorForm.platforms, platform],
    });
  };

  const inputClassName = "w-full px-4 py-3 bg-[#1a1f2e] rounded-xl border border-white/10 text-[#d5dbe6] placeholder:text-[#d5dbe6]/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30";

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

      {/* Contact Section */}
      <section className="relative pt-28 sm:pt-32 md:pt-40 pb-20 sm:pb-24 md:pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <MessageCircle className="w-4 h-4 text-[#0066FF]" />
              <span className="text-sm font-medium text-[#d5dbe6] uppercase tracking-wider">Contact</span>
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
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#d5dbe6]/70 text-lg sm:text-xl max-w-3xl mx-auto"
            >
              Whether you have questions about our services or need personalized attention, our team is ready to help you.
            </motion.p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card - Email Us */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                className="rounded-[24px] p-8 h-full border border-white/[0.07]"
                style={{
                  background: 'linear-gradient(145deg, #10131c, #0a0d14)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066FF]/20 to-[#0066FF]/10 border border-[#0066FF]/30 flex items-center justify-center mb-6 shadow-lg">
                <Mail className="w-6 h-6 text-[#0066FF]" />
              </div>
              <h2 className="text-[#d5dbe6] text-2xl font-semibold mb-3">Email Us</h2>
              <p className="text-[#d5dbe6]/70 text-base mb-6">
                Looking to work with us? We're just one email away.
              </p>
              <a
                href="mailto:contact@sylcroad.com"
                className="text-white font-medium hover:underline"
              >
                contact@sylcroad.com
              </a>
              </div>
            </motion.div>

            {/* Right Card - Join Us Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div
                className="rounded-[24px] p-8 border border-white/[0.07]"
                style={{
                  background: 'linear-gradient(145deg, #10131c, #0a0d14)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066FF]/20 to-[#0066FF]/10 border border-[#0066FF]/30 flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-6 h-6 text-[#0066FF]" />
              </div>
              <h2 className="text-[#d5dbe6] text-2xl font-semibold mb-6">Join Us</h2>

              {/* Selector Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setUserType('company')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all cursor-pointer ${
                    userType === 'company'
                      ? 'bg-white text-[#04070d] shadow-lg'
                      : 'bg-[#1a1f2e] border border-white/10 text-[#d5dbe6] hover:bg-white/5'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Company
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('creator')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all cursor-pointer ${
                    userType === 'creator'
                      ? 'bg-white text-[#04070d] shadow-lg'
                      : 'bg-[#1a1f2e] border border-white/10 text-[#d5dbe6] hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Creator
                </button>
              </div>

              {/* Company Form */}
              {userType === 'company' && (
                <form onSubmit={handleCompanySubmit} className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={companyForm.fullName}
                    onChange={handleCompanyChange}
                    className={inputClassName}
                    required
                  />
                  <input
                    type="email"
                    name="workEmail"
                    placeholder="Work Email"
                    value={companyForm.workEmail}
                    onChange={handleCompanyChange}
                    className={inputClassName}
                    required
                  />
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={companyForm.companyName}
                    onChange={handleCompanyChange}
                    className={inputClassName}
                    required
                  />
                  <div>
                    <input
                      type="url"
                      name="website"
                      placeholder="Website (optional)"
                      value={companyForm.website}
                      onChange={handleCompanyChange}
                      className={inputClassName}
                    />
                  </div>

                  <input
                    type="text"
                    name="lastYearSpend"
                    placeholder="Last year's social media marketing spend (optional)"
                    value={companyForm.lastYearSpend}
                    onChange={handleCompanyChange}
                    className={inputClassName}
                  />

                  <textarea
                    name="goals"
                    placeholder="Tell us about your goals..."
                    value={companyForm.goals}
                    onChange={handleCompanyChange}
                    rows={3}
                    className={`${inputClassName} resize-none`}
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full h-auto py-3 px-6 text-base font-medium rounded-xl bg-[#0066FF] text-white transition-all duration-200 hover:bg-[#0055DD] cursor-pointer"
                    style={{
                      boxShadow: '0 4px 24px rgba(0, 102, 255, 0.3)'
                    }}
                  >
                    Book Strategy Call
                  </Button>
                </form>
              )}

              {/* Creator Form */}
              {userType === 'creator' && (
                <form onSubmit={handleCreatorSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={creatorForm.fullName}
                    onChange={handleCreatorChange}
                    className={inputClassName}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={creatorForm.email}
                    onChange={handleCreatorChange}
                    className={inputClassName}
                    required
                  />
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d5dbe6]/40">@</span>
                    <input
                      type="text"
                      name="socialHandle"
                      placeholder="yourusername"
                      value={creatorForm.socialHandle}
                      onChange={handleCreatorChange}
                      className={`${inputClassName} pl-8`}
                      required
                    />
                  </div>

                  {/* Platforms */}
                  <div>
                    <label className="block text-[#d5dbe6] text-sm font-medium mb-3">
                      Platforms
                    </label>
                    <div className="flex gap-2">
                      {platformOptions.map((platform) => (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => togglePlatform(platform)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                            creatorForm.platforms.includes(platform)
                              ? 'bg-white text-[#04070d]'
                              : 'bg-[#1a1f2e] border border-white/10 text-[#d5dbe6] hover:bg-white/5'
                          }`}
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    name="niche"
                    placeholder="Your Niche (e.g., Fitness, Tech, Lifestyle)"
                    value={creatorForm.niche}
                    onChange={handleCreatorChange}
                    className={inputClassName}
                    required
                  />

                  <div>
                    <textarea
                      name="stats"
                      placeholder="Your Stats (optional) - followers, avg views, engagement rate..."
                      value={creatorForm.stats}
                      onChange={handleCreatorChange}
                      rows={2}
                      className={`${inputClassName} resize-none`}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-auto py-3 px-6 text-base font-medium rounded-xl bg-[#0066FF] text-white transition-all duration-200 hover:bg-[#0055DD] cursor-pointer"
                    style={{
                      boxShadow: '0 4px 24px rgba(0, 102, 255, 0.3)'
                    }}
                  >
                    Apply as a Creator
                  </Button>
                </form>
              )}

              {/* Initial State - No selection */}
              {userType === null && (
                <p className="text-[#d5dbe6]/50 text-center py-8">
                  Select whether you're a Company or Creator to continue
                </p>
              )}
              </div>
            </motion.div>
          </div>
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

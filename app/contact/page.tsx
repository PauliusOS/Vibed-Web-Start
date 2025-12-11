'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Users, MessageCircle, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
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

  const inputClassName = "w-full px-4 py-3 bg-white rounded-xl border border-black/10 text-[#16101e] placeholder:text-[#16101e]/40 focus:outline-none focus:ring-2 focus:ring-[#09f]/20 focus:border-[#09f]/40";

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f4f4f4]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logos/silkroad-logo.png"
                alt="SilkRoad"
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

      {/* Contact Section */}
      <section className="relative pt-28 sm:pt-32 md:pt-40 pb-20 sm:pb-24 md:pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#f4f4f4] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_2px_8px_rgba(255,255,255,0.95)]">
              <MessageCircle className="w-4 h-4 text-[#6b6b6b]" />
              <span className="text-sm font-medium text-[#3a3a3a] uppercase tracking-wider">Contact</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-[#16101e] text-4xl sm:text-5xl md:text-6xl font-serif italic mb-4 sm:mb-6">
              Get in Touch
            </h1>
            <p className="text-[#16101e]/70 text-lg sm:text-xl max-w-3xl mx-auto">
              Whether you have questions about our services or need personalized attention, our team is ready to help you.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card - Email Us */}
            <div className="bg-[#f4f4f4] rounded-[24px] p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(255,255,255,0.95)]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-t from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center mb-6 shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-[#16101e] text-2xl font-semibold mb-3">Email Us</h2>
              <p className="text-[#16101e]/70 text-base mb-6">
                Looking to work with us? We're just one email away.
              </p>
              <a
                href="mailto:contact@silkroad.com"
                className="text-[#09f] font-medium hover:underline"
              >
                contact@silkroad.com
              </a>
            </div>

            {/* Right Card - Join Us Form */}
            <div className="bg-[#f4f4f4] rounded-[24px] p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(255,255,255,0.95)]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-t from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-[#16101e] text-2xl font-semibold mb-6">Join Us</h2>

              {/* Selector Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setUserType('company')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                    userType === 'company'
                      ? 'bg-[#16101e] text-white shadow-lg'
                      : 'bg-white border border-black/10 text-[#16101e] hover:bg-black/5'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Company
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('creator')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                    userType === 'creator'
                      ? 'bg-[#16101e] text-white shadow-lg'
                      : 'bg-white border border-black/10 text-[#16101e] hover:bg-black/5'
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
                    className="w-full h-auto py-3 px-6 text-base font-medium rounded-xl bg-[#16101e] text-white transition-shadow duration-200 hover:shadow-lg hover:bg-[#16101e]"
                    style={{
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
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
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#16101e]/40">@</span>
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
                    <label className="block text-[#16101e] text-sm font-medium mb-3">
                      Platforms
                    </label>
                    <div className="flex gap-2">
                      {platformOptions.map((platform) => (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => togglePlatform(platform)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            creatorForm.platforms.includes(platform)
                              ? 'bg-[#09f] text-white'
                              : 'bg-white border border-black/10 text-[#16101e] hover:bg-black/5'
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
                    className="w-full h-auto py-3 px-6 text-base font-medium rounded-xl bg-[#16101e] text-white transition-shadow duration-200 hover:shadow-lg hover:bg-[#16101e]"
                    style={{
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    Apply as a Creator
                  </Button>
                </form>
              )}

              {/* Initial State - No selection */}
              {userType === null && (
                <p className="text-[#16101e]/50 text-center py-8">
                  Select whether you're a Company or Creator to continue
                </p>
              )}
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

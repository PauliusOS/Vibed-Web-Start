'use client';

export function WhyChooseUs() {
  const comparisons = [
    {
      feature: 'Custom Strategy',
      silkroad: 'Tailored approach for each brand',
      others: 'One-size-fits-all templates',
    },
    {
      feature: 'Real-Time Tracking',
      silkroad: 'Proprietary platform with 24/7 access',
      others: 'Monthly reports or no tracking',
    },
    {
      feature: 'Influencer Matching',
      silkroad: 'Hand-picked, vetted creators',
      others: 'Automated, follower-count based',
    },
    {
      feature: 'Pricing & Deals',
      silkroad: 'Expert negotiation for best ROI',
      others: 'Standard rates, no negotiation',
    },
    {
      feature: 'Campaign Management',
      silkroad: 'Full-service, end-to-end support',
      others: 'Self-service or minimal support',
    },
    {
      feature: 'Transparency',
      silkroad: 'Complete visibility into all metrics',
      others: 'Limited insight, black box approach',
    },
  ];

  return (
    <section id="why-us" className="relative py-20 sm:py-24 md:py-32 border-t border-black/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-[#16101e] text-4xl sm:text-5xl font-bold mb-4 sm:mb-6">
            Why Choose SilkRoad?
          </h2>
          <p className="text-[#16101e]/70 text-lg sm:text-xl max-w-3xl mx-auto">
            We're not just another agency—we're your strategic partner in influencer marketing.
          </p>
        </div>

        {/* Comparison Table */}
        <div
          className="rounded-[24px] overflow-hidden"
          style={{
            backgroundColor: '#f4f4f4',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 4px 12px rgba(255, 255, 255, 0.95)'
          }}
        >
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-black/5 border-b border-black/10">
            <div className="text-[#16101e]/60 text-sm font-semibold uppercase tracking-wide">
              Feature
            </div>
            <div className="text-center">
              <span className="text-[#09f] text-lg font-bold">SilkRoad</span>
            </div>
            <div className="text-center">
              <span className="text-[#16101e]/60 text-lg font-semibold">Others</span>
            </div>
          </div>

          {/* Comparison Rows */}
          {comparisons.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 p-6 border-b border-black/5 last:border-b-0 hover:bg-black/5 transition-colors"
            >
              {/* Feature Name */}
              <div className="text-[#16101e] font-semibold text-base">
                {item.feature}
              </div>

              {/* SilkRoad */}
              <div className="text-center flex items-center justify-center">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#09f] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#16101e]/90 text-sm">{item.silkroad}</span>
                </div>
              </div>

              {/* Others */}
              <div className="text-center flex items-center justify-center">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#16101e]/30 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#16101e]/50 text-sm">{item.others}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

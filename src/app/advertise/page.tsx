import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Advertise With Us',
  description: 'Reach motivated students and families planning for top colleges. Explore advertising opportunities with Top College Planning.',
}

const PACKAGES = [
  {
    name: 'Starter',
    price: '$499',
    period: '/month',
    description: 'Perfect for tutoring centers, test prep services, and local education brands.',
    features: [
      'Banner ad placement (sidebar)',
      'Up to 10,000 impressions/month',
      'Mobile-optimized ad units',
      'Monthly performance report',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$1,499',
    period: '/month',
    description: 'Ideal for education platforms, online courses, and national brands.',
    features: [
      'Homepage featured placement',
      'Up to 50,000 impressions/month',
      'Sponsored article (1/month)',
      'Newsletter mention (1/month)',
      'Bi-weekly performance report',
      'Dedicated account manager',
    ],
    cta: 'Most Popular',
    highlight: true,
  },
  {
    name: 'Premium',
    price: 'Custom',
    period: '',
    description: 'Full-site partnerships for universities, ed-tech companies, and major brands.',
    features: [
      'Exclusive category sponsorship',
      'Unlimited impressions',
      'Multiple sponsored articles',
      'Newsletter sponsorship',
      'Social media cross-promotion',
      'Custom branded content',
      'Co-branded events or webinars',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
]

const STATS = [
  { value: '250K+', label: 'Monthly Visitors' },
  { value: '85%', label: 'College-Bound Students' },
  { value: '60%', label: 'Parents & Guardians' },
  { value: '40+', label: 'Countries Reached' },
]

const AD_FORMATS = [
  { icon: '🖼️', title: 'Display Ads', desc: 'High-visibility banner and sidebar placements across all pages.' },
  { icon: '✍️', title: 'Sponsored Content', desc: 'Branded articles and guides that educate while promoting your service.' },
  { icon: '📧', title: 'Newsletter Ads', desc: 'Reach our engaged email subscribers with targeted placements.' },
  { icon: '🎯', title: 'Targeted Placements', desc: 'Appear on specific pages — Ivy League, Business Schools, Law Schools, and more.' },
  { icon: '🎙️', title: 'Webinar Sponsorship', desc: 'Co-sponsor our college admissions webinars and Q&A sessions.' },
  { icon: '👤', title: 'Alumni Spotlights', desc: 'Feature your brand alongside inspiring alumni success stories.' },
]

export default function AdvertisePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-orange text-sm font-bold uppercase tracking-widest mb-3">Partner With Us</p>
          <h1 className="text-4xl md:text-5xl font-black mb-6">Advertise With Top College Planning</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Connect your brand with hundreds of thousands of motivated students, parents, and families actively
            planning for elite colleges and universities.
          </p>
          <a
            href="mailto:advertise@topcollegeplanning.com"
            className="mt-8 inline-block bg-brand-orange text-white font-black px-8 py-4 uppercase tracking-wide hover:bg-orange-600 transition-colors text-lg"
          >
            Get a Media Kit →
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl font-black text-brand-orange">{value}</p>
                <p className="text-gray-600 font-semibold mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who we reach */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-navy mb-4">Our Audience</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Our readers are among the most motivated and high-intent education consumers in the world.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🎓', title: 'High School Students', desc: 'Juniors and seniors actively researching and applying to top colleges, including Ivy League, M7 business schools, and elite universities.' },
            { icon: '👨‍👩‍👧', title: 'Parents & Families', desc: 'Parents playing an active role in their child\'s college search, comparing schools, costs, and financial aid options.' },
            { icon: '🌍', title: 'International Students', desc: 'Students from 40+ countries seeking to study in the U.S. — one of the fastest-growing and highest-value audiences in higher education.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="border-2 border-gray-100 p-8 hover:border-brand-orange transition-colors">
              <span className="text-4xl">{icon}</span>
              <h3 className="text-xl font-black text-navy mt-4 mb-2">{title}</h3>
              <p className="text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ad formats */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-navy mb-4">Advertising Formats</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Multiple formats to fit your brand objectives and budget.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AD_FORMATS.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <span className="text-3xl">{icon}</span>
                <h3 className="text-lg font-black text-navy mt-3 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-navy mb-4">Advertising Packages</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Flexible options for brands of all sizes.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PACKAGES.map(({ name, price, period, description, features, cta, highlight }) => (
            <div
              key={name}
              className={`relative border-2 p-8 flex flex-col ${highlight ? 'border-brand-orange shadow-xl' : 'border-gray-200'}`}
            >
              {highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-orange text-white text-xs font-black uppercase tracking-widest px-4 py-1.5">
                    Most Popular
                  </span>
                </div>
              )}
              <p className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-1">{name}</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-navy">{price}</span>
                <span className="text-gray-400 font-semibold">{period}</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">{description}</p>
              <ul className="space-y-2 flex-1 mb-8">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-brand-orange font-black mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:advertise@topcollegeplanning.com"
                className={`block text-center font-black py-3 uppercase tracking-wide transition-colors text-sm ${
                  highlight
                    ? 'bg-brand-orange text-white hover:bg-orange-600'
                    : 'bg-navy text-white hover:bg-blue-900'
                }`}
              >
                {cta} →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-navy text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black mb-4">Ready to Reach Your Next Student?</h2>
          <p className="text-gray-300 mb-8">
            Contact our partnerships team for a custom media kit, audience data, and available inventory.
          </p>
          <a
            href="mailto:advertise@topcollegeplanning.com"
            className="inline-block bg-brand-orange text-white font-black px-8 py-4 uppercase tracking-wide hover:bg-orange-600 transition-colors"
          >
            advertise@topcollegeplanning.com
          </a>
        </div>
      </div>
    </div>
  )
}

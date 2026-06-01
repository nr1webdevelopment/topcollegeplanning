import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the Top College Planning team. We\'re looking for passionate educators, advisors, and content creators.',
}

const OPEN_ROLES = [
  {
    title: 'College Admissions Advisor',
    type: 'Full-Time · Remote',
    department: 'Advising',
    description:
      'Guide students through the college application process with personalized strategy, essay coaching, and school selection. You\'ll work with motivated students aiming for top-50 universities.',
    requirements: [
      'Degree from a top-50 U.S. university (Ivy League or equivalent preferred)',
      '2+ years of college counseling, admissions, or related experience',
      'Excellent written and verbal communication skills',
      'Passion for education and student success',
      'Ability to manage 20–30 student clients simultaneously',
    ],
  },
  {
    title: 'Content Writer — College Admissions',
    type: 'Full-Time or Contract · Remote',
    department: 'Content',
    description:
      'Research and write engaging, accurate, and SEO-optimized articles about college admissions, financial aid, campus life, rankings, and notable alumni. Your writing will reach hundreds of thousands of students and families.',
    requirements: [
      'Bachelor\'s degree required; degree in Journalism, English, or Education a plus',
      'Portfolio of published writing on education or related topics',
      'Ability to write clearly for a student and parent audience',
      'Familiarity with U.S. college admissions landscape',
      'SEO writing experience preferred',
    ],
  },
  {
    title: 'Social Media & Marketing Coordinator',
    type: 'Full-Time · Remote',
    department: 'Marketing',
    description:
      'Grow and manage Top College Planning\'s presence across Instagram, TikTok, YouTube, and LinkedIn. You\'ll create content, engage our audience, and run targeted campaigns to reach high school students and parents.',
    requirements: [
      'Experience managing social media accounts with proven growth results',
      'Video editing and short-form content creation skills (Reels, TikTok)',
      'Strong understanding of Gen Z content trends and education topics',
      'Experience with paid social advertising a plus',
      'Bachelor\'s degree in Marketing, Communications, or related field preferred',
    ],
  },
  {
    title: 'Full-Stack Developer',
    type: 'Full-Time · Remote',
    department: 'Engineering',
    description:
      'Help build and improve the Top College Planning platform. You\'ll work on our Next.js website, content management systems, and user-facing tools like our college cost calculator and comparison features.',
    requirements: [
      'Proficiency in TypeScript, React, and Next.js',
      'Experience with Tailwind CSS and modern web design patterns',
      'Familiarity with REST APIs and content management systems',
      'Strong eye for design and UX',
      '2+ years of professional web development experience',
    ],
  },
  {
    title: 'Partnerships & Outreach Manager',
    type: 'Full-Time · Remote',
    department: 'Business Development',
    description:
      'Build relationships with schools, test prep companies, educational nonprofits, and brands to grow Top College Planning\'s network of partners and sponsors. You\'ll develop and manage advertising and sponsorship packages.',
    requirements: [
      '3+ years of sales, partnerships, or business development experience',
      'Experience in the education or media industry preferred',
      'Strong negotiation and communication skills',
      'Self-starter with experience managing a pipeline independently',
    ],
  },
]

const PERKS = [
  { icon: '🌍', title: 'Fully Remote', desc: 'Work from anywhere in the world. Flexible hours.' },
  { icon: '📚', title: 'Education Stipend', desc: '$1,000/year for professional development and online learning.' },
  { icon: '💻', title: 'Home Office Setup', desc: '$500 one-time home office equipment allowance.' },
  { icon: '🏖️', title: 'Flexible PTO', desc: 'Unlimited vacation with a minimum of 15 days encouraged.' },
  { icon: '🩺', title: 'Health Benefits', desc: 'Medical, dental, and vision coverage for full-time employees.' },
  { icon: '🎓', title: 'Mission-Driven', desc: 'Help students achieve their dreams of attending top schools.' },
]

export default function CareerPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange text-sm font-bold uppercase tracking-widest mb-3">Join Our Team</p>
          <h1 className="text-4xl md:text-5xl font-black mb-6 max-w-2xl">
            Help Students Reach Their Dream Schools
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            We're a passionate team of educators, advisors, and builders on a mission to make elite higher education
            more accessible to students everywhere. Come work with us — remotely, flexibly, and meaningfully.
          </p>
        </div>
      </div>

      {/* Perks */}
      <div className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-navy mb-10 text-center">Why Work Here</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERKS.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white p-6 border border-gray-100 flex gap-4 items-start">
                <span className="text-3xl shrink-0">{icon}</span>
                <div>
                  <p className="font-black text-navy">{title}</p>
                  <p className="text-gray-500 text-sm mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Roles */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-black text-navy mb-2">Open Positions</h2>
        <p className="text-gray-500 mb-10">All roles are fully remote unless otherwise noted.</p>

        <div className="space-y-6">
          {OPEN_ROLES.map(({ title, type, department, description, requirements }) => (
            <details
              key={title}
              className="group border-2 border-gray-200 hover:border-brand-orange transition-colors open:border-brand-orange"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-1">{department}</p>
                  <h3 className="text-xl font-black text-navy">{title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{type}</p>
                </div>
                <span className="text-brand-orange font-black text-2xl transition-transform group-open:rotate-45 shrink-0 ml-4">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 border-t border-gray-100 pt-5">
                <p className="text-gray-700 leading-relaxed mb-5">{description}</p>
                <p className="font-black text-navy text-sm uppercase tracking-wide mb-3">Requirements</p>
                <ul className="space-y-2 mb-6">
                  {requirements.map(r => (
                    <li key={r} className="flex items-start gap-2 text-gray-600 text-sm">
                      <span className="text-brand-orange font-black mt-0.5 shrink-0">✓</span>
                      {r}
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:careers@topcollegeplanning.com?subject=Application: ${encodeURIComponent(title)}`}
                  className="inline-block bg-brand-orange text-white font-black px-6 py-3 uppercase tracking-wide hover:bg-orange-600 transition-colors text-sm"
                >
                  Apply for This Role →
                </a>
              </div>
            </details>
          ))}
        </div>

        {/* No role CTA */}
        <div className="mt-16 bg-navy text-white p-10 text-center">
          <h3 className="text-2xl font-black mb-3">Don't See Your Role?</h3>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            We're always looking for talented people who care about education. Send us your résumé and tell us how
            you'd contribute.
          </p>
          <a
            href="mailto:careers@topcollegeplanning.com?subject=General Application"
            className="inline-block bg-brand-orange text-white font-black px-8 py-3 uppercase tracking-wide hover:bg-orange-600 transition-colors"
          >
            Send a General Application →
          </a>
        </div>
      </div>
    </div>
  )
}

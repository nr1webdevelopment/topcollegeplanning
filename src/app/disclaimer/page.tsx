import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important disclaimers regarding the educational content and college planning advice on Top College Planning.',
}

export default function DisclaimerPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange text-sm font-bold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Disclaimer</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Please read this disclaimer carefully before relying on any content published on Top College Planning.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">

        {/* General */}
        <DisclaimerCard
          icon="📚"
          title="General Information Only"
          color="border-brand-orange"
        >
          <p>
            All content published on Top College Planning — including articles, blog posts, alumni profiles, school
            rankings, statistics, and advice — is provided for <strong>general informational and educational purposes
            only</strong>. It does not constitute professional college admissions counseling, legal advice, financial
            advice, or any other form of professional advice.
          </p>
          <p className="mt-3">
            While we strive to keep our information accurate and up to date, we make no representations or warranties
            of any kind — express or implied — about the completeness, accuracy, reliability, or suitability of the
            information for any purpose.
          </p>
        </DisclaimerCard>

        {/* No Guarantees */}
        <DisclaimerCard
          icon="🎓"
          title="No Admissions Guarantees"
          color="border-blue-500"
        >
          <p>
            Top College Planning does not guarantee admission to any college, university, or graduate program.
            College admissions outcomes depend on a wide range of factors — academic records, test scores, essays,
            extracurricular activities, institutional priorities, and more — that are entirely within the discretion
            of each individual institution.
          </p>
          <p className="mt-3">
            Any statistics, acceptance rates, or outcomes mentioned on this website reflect historical data and should
            not be interpreted as predictions of future results for any individual applicant.
          </p>
        </DisclaimerCard>

        {/* Alumni Profiles */}
        <DisclaimerCard
          icon="👤"
          title="Alumni Profiles & Public Figures"
          color="border-green-500"
        >
          <p>
            Alumni profiles and biographical information about public figures are compiled from publicly available
            sources including Wikipedia, official university records, news archives, and publicly released statements.
            These profiles are presented for inspirational and educational purposes only.
          </p>
          <p className="mt-3">
            Top College Planning is not affiliated with, endorsed by, or officially connected to any of the
            individuals profiled on this site, nor to the universities they attended. All trademarks, logos, and
            university names are the property of their respective owners.
          </p>
        </DisclaimerCard>

        {/* Financial Info */}
        <DisclaimerCard
          icon="💰"
          title="Financial Information"
          color="border-yellow-500"
        >
          <p>
            Information about tuition costs, scholarships, financial aid, and student loans is provided for
            general reference only. Tuition and financial aid packages change frequently. Always verify the most
            current figures directly with the institution's financial aid office.
          </p>
          <p className="mt-3">
            Nothing on this website constitutes financial advice. For guidance on education financing, please
            consult a qualified financial advisor.
          </p>
        </DisclaimerCard>

        {/* External Links */}
        <DisclaimerCard
          icon="🔗"
          title="External Links"
          color="border-purple-500"
        >
          <p>
            Our website may contain links to external websites for your convenience and reference. Top College Planning
            has no control over the content, accuracy, or practices of those sites, and assumes no responsibility
            for them. The inclusion of any link does not imply endorsement of the linked site.
          </p>
        </DisclaimerCard>

        {/* Accuracy */}
        <DisclaimerCard
          icon="📊"
          title="Accuracy of Rankings & Data"
          color="border-red-400"
        >
          <p>
            College rankings, statistics, and comparative data presented on this site are drawn from third-party
            sources (such as U.S. News & World Report, QS World Rankings, and government databases) and are subject
            to change. Rankings methodologies vary across publications, and no single ranking system should be
            considered definitive.
          </p>
          <p className="mt-3">
            We encourage students and families to consider multiple factors — beyond rankings alone — when evaluating
            colleges, including campus culture, academic programs, location, and financial fit.
          </p>
        </DisclaimerCard>

        {/* Contact */}
        <div className="bg-navy text-white p-8 mt-8">
          <h2 className="text-2xl font-black mb-2">Questions?</h2>
          <p className="text-gray-300 mb-4">
            If you have concerns about any content on this site or believe any information is inaccurate, please
            reach out to us. We take accuracy seriously and will review any concerns promptly.
          </p>
          <a
            href="mailto:info@topcollegeplanning.com"
            className="inline-block bg-brand-orange text-white font-bold px-6 py-3 uppercase tracking-wide hover:bg-orange-600 transition-colors"
          >
            Contact Us →
          </a>
        </div>
      </div>
    </div>
  )
}

function DisclaimerCard({
  icon, title, color, children,
}: {
  icon: string; title: string; color: string; children: React.ReactNode
}) {
  return (
    <div className={`border-l-4 ${color} bg-gray-50 p-7`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{icon}</span>
        <h2 className="text-xl font-black text-navy">{title}</h2>
      </div>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </div>
  )
}

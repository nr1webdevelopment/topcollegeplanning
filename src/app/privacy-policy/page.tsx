import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Top College Planning collects, uses, and protects your personal information.',
}

const LAST_UPDATED = 'January 1, 2025'

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange text-sm font-bold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>
          <p className="text-gray-300">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-lg max-w-none">
        <Section title="1. Introduction">
          <p>
            Top College Planning ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you visit our website at{' '}
            <strong>topcollegeplanning.com</strong> and use our college planning services.
          </p>
          <p>
            Please read this policy carefully. If you disagree with its terms, please discontinue use of the site.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We may collect the following types of information:</p>
          <SubList items={[
            { title: 'Personal Identification Information', body: 'Name, email address, phone number, and other contact details you voluntarily provide when filling out forms, subscribing to our newsletter, or contacting us.' },
            { title: 'Student & Academic Information', body: 'GPA, test scores, grade level, target schools, and other educational information you share when requesting personalized college planning advice.' },
            { title: 'Usage Data', body: 'Information about how you interact with our website, including pages visited, time spent, referring URLs, browser type, and device information.' },
            { title: 'Cookies & Tracking Technologies', body: 'We use cookies and similar tracking technologies to improve your browsing experience and analyze site traffic. You may disable cookies via your browser settings.' },
          ]} />
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and improve our college planning services</li>
            <li>Respond to inquiries and fulfill requests for information or consultations</li>
            <li>Send newsletters, updates, and promotional communications (with your consent)</li>
            <li>Analyze usage trends to improve the website experience</li>
            <li>Comply with legal obligations and enforce our policies</li>
            <li>Prevent fraud and ensure the security of our platform</li>
          </ul>
        </Section>

        <Section title="4. Sharing Your Information">
          <p>
            We do not sell, rent, or trade your personal information to third parties. We may share your information
            only in the following circumstances:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> Trusted third-party vendors who assist us in operating our website (e.g., email platforms, analytics providers), subject to confidentiality agreements.</li>
            <li><strong>Legal Requirements:</strong> When required by law, regulation, or valid legal process.</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with appropriate notice.</li>
            <li><strong>With Your Consent:</strong> For any other purpose with your explicit consent.</li>
          </ul>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We retain your personal information only as long as necessary to fulfill the purposes described in this
            policy, comply with legal obligations, resolve disputes, and enforce our agreements. When no longer needed,
            we securely delete or anonymize your data.
          </p>
        </Section>

        <Section title="6. Your Rights">
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate or incomplete data</li>
            <li>Request deletion of your personal data</li>
            <li>Opt out of marketing communications at any time</li>
            <li>Lodge a complaint with your local data protection authority</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{' '}
            <a href="mailto:privacy@topcollegeplanning.com" className="text-brand-orange font-semibold">
              privacy@topcollegeplanning.com
            </a>.
          </p>
        </Section>

        <Section title="7. Children's Privacy">
          <p>
            Our website is intended for students of high school age (13 and older) and their parents or guardians.
            We do not knowingly collect personal information from children under 13. If you believe a child under 13
            has provided us with personal data, please contact us immediately and we will delete it.
          </p>
        </Section>

        <Section title="8. Security">
          <p>
            We implement reasonable administrative, technical, and physical safeguards to protect your personal
            information. However, no method of internet transmission is 100% secure, and we cannot guarantee absolute
            security.
          </p>
        </Section>

        <Section title="9. Third-Party Links">
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices
            of those sites and encourage you to review their privacy policies before providing any personal information.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by
            updating the "Last updated" date at the top of this page. Continued use of the site after changes
            constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
          <ContactBlock />
        </Section>
      </div>
    </div>
  )
}

// ── Shared sub-components ──────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-black text-navy mb-4 pb-2 border-b-2 border-brand-orange inline-block">
        {title}
      </h2>
      <div className="text-gray-700 leading-relaxed space-y-4">{children}</div>
    </section>
  )
}

function SubList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className="space-y-3">
      {items.map(({ title, body }) => (
        <li key={title}>
          <strong className="text-navy">{title}:</strong> {body}
        </li>
      ))}
    </ul>
  )
}

function ContactBlock() {
  return (
    <div className="bg-gray-50 border-l-4 border-brand-orange p-6 mt-4">
      <p className="font-black text-navy text-lg">Top College Planning</p>
      <p className="text-gray-600 mt-1">Email: <a href="mailto:info@topcollegeplanning.com" className="text-brand-orange">info@topcollegeplanning.com</a></p>
      <p className="text-gray-600">Website: <span className="text-brand-orange">topcollegeplanning.com</span></p>
    </div>
  )
}

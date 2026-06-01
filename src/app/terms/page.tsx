import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions governing your use of Top College Planning.',
}

const LAST_UPDATED = 'January 1, 2025'

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange text-sm font-bold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Terms of Service</h1>
          <p className="text-gray-300">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-5 mb-10 rounded">
          <p className="text-amber-800 font-semibold text-sm">
            Please read these Terms of Service carefully before using Top College Planning. By accessing or using our
            website, you agree to be bound by these terms. If you do not agree, please do not use our services.
          </p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>
            These Terms of Service ("Terms") govern your access to and use of the Top College Planning website,
            content, and services (collectively, the "Service"). By using the Service, you confirm that you are
            at least 13 years of age and that you agree to these Terms and our Privacy Policy.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            Top College Planning provides educational content, college admissions guidance, alumni profiles,
            school rankings, and related informational resources. Our services include:
          </p>
          <ul>
            <li>Informational articles and blog posts about college admissions</li>
            <li>Profiles of notable alumni from top universities</li>
            <li>College cost calculators and comparison tools</li>
            <li>Advice from advisors affiliated with top U.S. universities</li>
            <li>Newsletter and email communications</li>
          </ul>
        </Section>

        <Section title="3. User Accounts">
          <p>
            Some features of the Service may require you to create an account. You are responsible for maintaining
            the confidentiality of your account credentials and for all activities that occur under your account.
            You agree to:
          </p>
          <ul>
            <li>Provide accurate and complete registration information</li>
            <li>Update your information to keep it current</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Not share your account credentials with any third party</li>
          </ul>
        </Section>

        <Section title="4. Intellectual Property">
          <p>
            All content on Top College Planning — including text, graphics, logos, images, articles, and software —
            is the property of Top College Planning or its content licensors and is protected by copyright,
            trademark, and other intellectual property laws.
          </p>
          <p>
            You may view, download, and print content for personal, non-commercial use only. You may not reproduce,
            distribute, modify, create derivative works from, publicly display, or commercially exploit any content
            without our prior written consent.
          </p>
        </Section>

        <Section title="5. User Conduct">
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Post or transmit any content that is unlawful, harmful, defamatory, or otherwise objectionable</li>
            <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
            <li>Collect or harvest any personally identifiable information from other users</li>
            <li>Engage in any activity that disrupts or interferes with the Service</li>
            <li>Attempt to gain unauthorized access to any portion of the Service</li>
            <li>Use automated means (bots, scrapers) to access the Service without our written permission</li>
          </ul>
        </Section>

        <Section title="6. Educational Content Disclaimer">
          <p>
            The content provided on Top College Planning is for general informational and educational purposes only.
            It does not constitute professional college admissions counseling advice. Admissions outcomes depend on
            many factors beyond our control, and we make no guarantees of acceptance to any institution.
          </p>
          <p>
            Always consult with qualified admissions professionals, school counselors, and the specific institutions
            you are applying to for guidance tailored to your individual circumstances.
          </p>
        </Section>

        <Section title="7. Third-Party Services">
          <p>
            The Service may contain links to third-party websites or integrate third-party services. We do not
            endorse or assume any responsibility for any third-party sites, information, materials, products,
            or services. Your interactions with third-party services are governed by their respective terms and
            privacy policies.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the fullest extent permitted by law, Top College Planning and its officers, directors, employees,
            and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages
            arising from your use of the Service, even if we have been advised of the possibility of such damages.
          </p>
          <p>
            Our total liability to you for any claim arising from these Terms or the Service shall not exceed
            the greater of $100 or the amount you paid us in the past twelve months.
          </p>
        </Section>

        <Section title="9. Indemnification">
          <p>
            You agree to indemnify and hold harmless Top College Planning and its affiliates, officers, agents,
            and employees from any claim or demand made by any third party arising out of your violation of
            these Terms or your violation of any law or the rights of a third party.
          </p>
        </Section>

        <Section title="10. Termination">
          <p>
            We reserve the right to suspend or terminate your access to the Service at any time, with or without
            notice, for conduct that we determine violates these Terms or is otherwise harmful to other users,
            us, or third parties.
          </p>
        </Section>

        <Section title="11. Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of California,
            without regard to its conflict of law provisions. Any disputes arising under these Terms shall be
            resolved in the state or federal courts located in Los Angeles County, California.
          </p>
        </Section>

        <Section title="12. Changes to Terms">
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of significant changes
            by posting a notice on our website or sending an email. Your continued use of the Service after
            changes take effect constitutes your acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>For questions about these Terms, please contact us:</p>
          <div className="bg-gray-50 border-l-4 border-brand-orange p-6 mt-4">
            <p className="font-black text-navy text-lg">Top College Planning</p>
            <p className="text-gray-600 mt-1">Email: <a href="mailto:legal@topcollegeplanning.com" className="text-brand-orange">legal@topcollegeplanning.com</a></p>
            <p className="text-gray-600">Website: <span className="text-brand-orange">topcollegeplanning.com</span></p>
          </div>
        </Section>
      </div>
    </div>
  )
}

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

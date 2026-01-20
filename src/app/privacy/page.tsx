import { FadeIn } from "@/components/ui/FadeIn";

export const metadata = {
  title: "Privacy Policy | Amp",
  description: "How Amp collects, uses, and protects your data.",
};

const sections = [
  {
    id: "data-collection",
    title: "Data Collection",
    content: [
      "We collect information you provide directly to us, such as when you create an account, request a demo, or contact us for support.",
      "This may include your name, email address, company name, phone number, and any other information you choose to provide.",
      "We also automatically collect certain information when you use our platform, including device information, IP address, browser type, and usage patterns.",
      "Our hardware devices collect energy consumption data from your building's electrical systems. This data is transmitted securely to our cloud platform for analysis.",
    ],
  },
  {
    id: "usage",
    title: "How We Use Your Data",
    content: [
      "We use the information we collect to provide, maintain, and improve our services, including processing energy data and generating insights for your building.",
      "Your data helps us develop new features, analyze usage patterns, and optimize our platform's performance.",
      "We may use your contact information to send you technical notices, updates, security alerts, and support messages.",
      "With your consent, we may send you marketing communications about products, services, and events. You can opt out at any time.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    content: [
      "We use cookies and similar tracking technologies to collect information about your browsing activities and to remember your preferences.",
      "Essential cookies are required for the platform to function properly. These cannot be disabled.",
      "Analytics cookies help us understand how visitors interact with our website. You can opt out of these through your browser settings.",
      "We do not use advertising cookies or sell your data to third-party advertisers.",
    ],
  },
  {
    id: "third-parties",
    title: "Third-Party Services",
    content: [
      "We may share your information with third-party service providers who perform services on our behalf, such as cloud hosting, analytics, and customer support.",
      "These providers are contractually obligated to protect your data and may only use it for the purposes we specify.",
      "We may also share information when required by law, to protect our rights, or in connection with a merger or acquisition.",
      "We do not sell your personal information to third parties.",
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: [
      "You have the right to access, correct, or delete your personal information at any time.",
      "You may request a copy of all data we hold about you in a portable format.",
      "You can withdraw consent for optional data processing, such as marketing communications.",
      "If you're in the EU, you have additional rights under GDPR, including the right to data portability and the right to lodge a complaint with a supervisory authority.",
      "To exercise any of these rights, please contact us using the information below.",
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    content: [
      "If you have any questions about this Privacy Policy or our data practices, please contact us:",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main>
      {/* Dark Header Section */}
      <section className="section-dark-base section-dark-gradient border-b border-white/10">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <FadeIn>
            <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
              Legal
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-lg text-gray-400 max-w-2xl">
              Your privacy matters to us. This policy explains how we collect,
              use, and protect your information when you use our platform and
              services.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Last updated: January 2026
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Light Content Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="space-y-16">
            {sections.map((section, index) => (
              <FadeIn key={section.id} delay={index * 0.05}>
                <article id={section.id}>
                  <h2 className="font-display text-2xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                  <div className="mt-6 space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-base leading-relaxed text-gray-600"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {section.id === "contact" && (
                      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
                        <p className="font-medium text-gray-900">
                          Amp Inc. - Legal Department
                        </p>
                        <a
                          href="mailto:legal@ampenergy.ae"
                          className="mt-2 block text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                        >
                          legal@ampenergy.ae
                        </a>
                        <address className="mt-4 text-sm text-gray-500 not-italic">
                          Floor 8, Tower 4
                          <br />
                          One Central, DWTC
                          <br />
                          Dubai, UAE
                        </address>
                      </div>
                    )}
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

          {/* Table of Contents - Side Navigation for Desktop */}
          <aside className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 w-48">
            <nav className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                On this page
              </p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block py-1.5 text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      </section>
    </main>
  );
}

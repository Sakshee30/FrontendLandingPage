import { Shield, Lock, Eye, FileText } from "lucide-react";
import { SEO } from "../../../shared/seo";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-slate-50 min-h-screen py-16 px-6 font-sans">
      <SEO
        title="Privacy Policy | Ziplin"
        description="Learn how Ziplin collects, uses, and protects your information when you use our link management platform."
        canonical="https://www.ziplin.io/legal/privacy"
        keywords={"privacy policy,Ziplin,data collection,GDPR compliance,cookie policy,link tracking privacy"}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4.5 py-1.5 text-sm font-semibold text-violet-750">
            <Shield className="w-4 h-4 text-violet-650" />
            Legal & Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Last updated: June 12, 2026. This policy describes how we collect, process, and safeguard your data.
          </p>
        </div>

        {/* Content Layout */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-150/30 space-y-10">
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed font-medium">
              At Ziplin, we believe privacy is a fundamental right. We are committed to transparency regarding the information we collect and process when you use our shortening, UTM tracking, and bio-page services.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 text-violet-600 border border-violet-100"><Eye size={16} /></span>
              1. Information We Collect
            </h2>
            <div className="pl-10 space-y-3 text-slate-600 text-sm leading-relaxed font-medium">
              <p>
                To provide our link optimization services, we collect two types of data:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Account Information:</strong> When you register, we collect your name, email address, password hash, and billing configuration profiles.
                </li>
                <li>
                  <strong>Redirect Metadata:</strong> When someone visits one of your Ziplin short links, our servers temporarily process visitor metrics (e.g., referrer path, click timestamps, device operating system, browser agent, and country location) to provide analytics dashboards.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100"><Lock size={16} /></span>
              2. How We Use Information
            </h2>
            <p className="pl-10 text-slate-600 text-sm leading-relaxed font-medium">
              Ziplin uses the collected metrics to serve redirects securely, generate real-time analytics reports, detect malware/phishing link abuse, and handle user support tickets. We do not sell user email lists or visitor click logs to third-party data broker companies.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100"><Shield size={16} /></span>
              3. Data Retention & GDPR Compliance
            </h2>
            <div className="pl-10 space-y-3 text-slate-600 text-sm leading-relaxed font-medium">
              <p>
                We comply with the EU General Data Protection Regulation (GDPR). Key features we implement to protect privacy include:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>IP Anonymization:</strong> Workspace owners can configure their account settings to automatically anonymize visitor IP addresses before logging analytics.
                </li>
                <li>
                  <strong>Right to Erasure:</strong> You can delete your account or any shortened link history at any time, which permanently purges the associated metadata logs from our database backups within 30 days.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100"><FileText size={16} /></span>
              4. Changes & Contact Info
            </h2>
            <p className="pl-10 text-slate-600 text-sm leading-relaxed font-medium">
              We may update this policy periodically to reflect platform upgrades. For questions about this policy or to request data exports, contact us at <a href="mailto:privacy@ziplin.io" className="text-violet-650 hover:underline">privacy@ziplin.io</a>.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

import { Scale, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { SEO } from "../../../shared/seo";

export default function TermsOfServicePage() {
  return (
    <main className="bg-slate-50 min-h-screen py-16 px-6 font-sans">
      <SEO
        title="Terms of Service | Ziplin"
        description="Review Ziplin's terms of service. Understand user responsibilities, restrictions, and general usage agreements."
        canonical="https://www.ziplin.io/legal/terms"
        keywords={"terms of service,Ziplin,usage policy,legal agreements,link shortener rules"}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4.5 py-1.5 text-sm font-semibold text-violet-750">
            <Scale className="w-4 h-4 text-violet-650" />
            Terms & Agreements
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Last updated: June 12, 2026. Please read these terms carefully before using Ziplin.
          </p>
        </div>

        {/* Content Layout */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-150/30 space-y-10">
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed font-medium">
              By accessing or using the Ziplin platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, you must immediately cease using all our link management, QR code, and bio page tools.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 text-violet-600 border border-violet-100"><CheckCircle size={16} /></span>
              1. Account Registration
            </h2>
            <p className="pl-10 text-slate-600 text-sm leading-relaxed font-medium">
              To utilize certain features, you must create a workspace account. You agree to provide accurate, current, and complete details, and maintain the confidentiality of your workspace login tokens. You are fully responsible for all campaigns and short links generated under your account.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-100"><AlertTriangle size={16} /></span>
              2. Prohibited Content & Abuse Policies
            </h2>
            <div className="pl-10 space-y-3 text-slate-600 text-sm leading-relaxed font-medium">
              <p>
                We maintain a strict zero-tolerance policy against platform abuse. You may not shorten, route, or generate QR links pointing to destinations containing:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Phishing, malware, trojan horses, or unverified software downloads.</li>
                <li>Spam emails, unsolicited SMS campaigns, or fraudulent marketing.</li>
                <li>Content that violates copyright laws or intellectual property rights.</li>
              </ul>
              <p>
                Ziplin reserves the right to scan redirected targets, suspend links instantly, and ban accounts violating these guidelines without prior notice.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100"><Scale size={16} /></span>
              3. Service Limitations & Uptime
            </h2>
            <p className="pl-10 text-slate-600 text-sm leading-relaxed font-medium">
              We strive to keep Ziplin redirections active 24/7. However, the platform is provided on an "as-is" and "as-available" basis. Ziplin does not guarantee uninterrupted redirection routing or that analytical clicks data will be 100% accurate at all times. High availability SLAs are limited strictly to customers on Enterprise agreements.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100"><FileText size={16} /></span>
              4. Termination & Indemnification
            </h2>
            <p className="pl-10 text-slate-600 text-sm leading-relaxed font-medium">
              We reserve the right to terminate your access to Ziplin at any time for violation of these terms. You agree to indemnify and hold harmless Ziplin, its developers, and affiliates from any claims arising out of your use of the platform.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

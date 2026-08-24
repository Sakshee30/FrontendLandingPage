import { useState } from "react";
import {
    Globe,
    Target,
    Tags,
    Key,
    Webhook,
    Users,
    Shield,
    CreditCard,
    DatabaseBackup,
} from "lucide-react";

import { SettingType } from "../../services/settings";
import { HelpButton } from "../HelpButton";
import { DomainSection } from "./DomainSection";
import { ResourceSection } from "./ResourceSection";
import { TeamSection } from "./TeamSection";
import { BackupSection } from "./BackupSection";
import { ComingSoonSection } from "./ComingSoonSection";

const settingsTabs = [
    {
        key: "domains",
        type: "domain" as SettingType,
        label: "Custom Domains",
        icon: Globe,
        desc: "Connect your own domain and verify DNS records.",
    },
    {
        key: "pixels",
        type: "pixel" as SettingType,
        label: "Pixels",
        icon: Target,
        desc: "Add retargeting pixels to track your link visitors.",
    },
    {
        key: "utm",
        type: "utm" as SettingType,
        label: "UTM Presets",
        icon: Tags,
        desc: "Create reusable UTM parameter templates for campaigns.",
    },
    {
        key: "api",
        type: "api_key" as SettingType,
        label: "API Keys",
        icon: Key,
        desc: "Generate API keys for integrations.",
    },
    {
        key: "webhooks",
        type: "webhook" as SettingType,
        label: "Webhooks",
        icon: Webhook,
        desc: "Send click events to your own endpoints in real time.",
    },
    {
        key: "team",
        label: "Team Members",
        icon: Users,
        desc: "Invite collaborators to your workspace.",
    },
    {
        key: "privacy",
        type: "privacy" as SettingType,
        label: "Privacy / GDPR",
        icon: Shield,
        desc: "Manage consent banners and retention settings.",
    },
    {
        key: "billing",
        type: "billing" as SettingType,
        label: "Billing",
        icon: CreditCard,
        desc: "Manage your subscription and invoices.",
    },
    {
        key: "backups",
        label: "Backups",
        icon: DatabaseBackup,
        desc: "Create, restore, encrypt, and retain workspace backups.",
    },
];

type Tab = (typeof settingsTabs)[number];

const settingsHelpTopics: Record<string, string> = {
    domains: "custom-domains",
    pixels: "settings-pixels",
    utm: "utm-presets",
    api: "api-keys",
    webhooks: "webhooks",
    team: "team-members",
    privacy: "privacy-gdpr",
    billing: "billing",
    backups: "backups",
};

export function Settings() {
    const [activeKey, setActiveKey] = useState("domains");

    const activeTab =
        settingsTabs.find((tab) => tab.key === activeKey) || settingsTabs[0];

    return (
        <div className="flex flex-col lg:flex-row h-full max-w-[1600px] bg-slate-50/10">
            {/* ========================================
          Desktop Sidebar
      ======================================== */}
            <aside className="hidden lg:block w-[260px] shrink-0 border-r border-[#D9E2EC] bg-white">
                <div className="p-6 sticky top-0">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-[#1C2433] mb-6">
                        Settings
                        <HelpButton topicId="settings" label="Settings" />
                    </h2>

                    <nav className="space-y-1">
                        {settingsTabs.map(({ key, label, icon: Icon }) => {
                            const isActive = activeKey === key;

                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveKey(key)}
                                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all text-left
                  ${isActive
                                            ? "bg-[#EEF4FF] text-[#081C45] font-semibold"
                                            : "text-[#1C2433] hover:bg-slate-100"
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* ========================================
          Main Content
      ======================================== */}
            <main className="flex-1 overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white border-b border-[#D9E2EC] px-4 py-4">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="font-bold text-lg text-[#1C2433]">
                            Settings
                        </h2>

                        <HelpButton topicId="settings" label="Settings" />
                    </div>

                    {/* Mobile Tabs */}
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-2 min-w-max pb-1">
                            {settingsTabs.map(({ key, label, icon: Icon }) => {
                                const isActive = activeKey === key;

                                return (
                                    <button
                                        key={key}
                                        onClick={() => setActiveKey(key)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm transition-all
                    ${isActive
                                                ? "bg-[#081C45] text-white"
                                                : "bg-white border border-slate-200 text-slate-700"
                                            }`}
                                    >
                                        <Icon size={14} />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="h-full overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="mb-6">
                        <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-[#1C2433]">
                            {activeTab.label}

                            <HelpButton
                                topicId={
                                    settingsHelpTopics[activeTab.key] || "settings"
                                }
                                label={activeTab.label}
                            />
                        </h1>

                        {"desc" in activeTab && (
                            <p className="mt-2 text-sm text-slate-500 max-w-3xl">
                                {activeTab.desc}
                            </p>
                        )}
                    </div>

                    {/* Section Content */}
                    {activeTab.key === "domains" ? (
                        <DomainSection />
                    ) : "type" in activeTab ? (
                        <ResourceSection
                            tab={activeTab as Tab & { type: SettingType }}
                        />
                    ) : activeTab.key === "team" ? (
                        <TeamSection />
                    ) : activeTab.key === "backups" ? (
                        <BackupSection />
                    ) : (
                        <ComingSoonSection tab={activeTab} />
                    )}
                </div>
            </main>
        </div>
    );
}

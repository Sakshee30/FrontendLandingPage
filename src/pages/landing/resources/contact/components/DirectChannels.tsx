import { Mail, HelpCircle, ShieldAlert, Sparkles } from "lucide-react";

const channels = [
  {
    icon: HelpCircle,
    title: "Support Engineering",
    email: "support@ziplin.io",
    desc: "For general dashboard inquiries, domain configs, or pixel issues.",
    reply: "Replies in < 30 mins",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100"
  },
  {
    icon: Sparkles,
    title: "Sales & Partnerships",
    email: "sales@ziplin.io",
    desc: "For high volume links quotas, custom SLAs, and custom team plans.",
    reply: "Replies in < 2 hrs",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100"
  },
  {
    icon: ShieldAlert,
    title: "Report Link Abuse",
    email: "abuse@ziplin.io",
    desc: "For reporting malicious link behavior, spam, or phishing campaigns.",
    reply: "Replies in < 1 hr",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100"
  }
];

export default function DirectChannels() {
  return (
    <section className="py-16 px-6 bg-slate-50/30 border-y border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900">Direct Channels</h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">Skip the form and email our dedicated departments directly</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {channels.map((channel, i) => {
            const Icon = channel.icon;
            return (
              <div key={i} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-300 text-left flex flex-col justify-between">
                <div>
                  <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl border ${channel.border} ${channel.bg} ${channel.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-md font-bold text-slate-900 mb-1">{channel.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{channel.desc}</p>
                </div>
                
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <a href={`mailto:${channel.email}`} className="text-sm font-extrabold text-indigo-650 hover:text-indigo-700 flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {channel.email}
                  </a>
                  <span className="text-[10px] font-bold text-slate-400 block mt-1.5">{channel.reply}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

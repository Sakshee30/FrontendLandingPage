import { useState, FormEvent } from "react";
import { Send, CheckCircle2, Mail, Phone, MapPin, Clock, Globe } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <section className="py-20 px-6 bg-slate-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] font-bold text-indigo-650 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full">
            Reach Out
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4">
            Connect With Us
          </h2>
          <p className="text-slate-550 font-medium leading-relaxed text-sm md:text-base">
            Have questions about pricing, features, or customized enterprise contracts? Send us a message and our support engineers will get back to you shortly.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between text-left">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6 flex-1 flex flex-col justify-center">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50/80 flex items-center justify-center text-indigo-650 shrink-0">
                  <Mail className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Us</h4>
                  <p className="text-sm font-bold text-slate-900 mt-1">hello@ziplin.io</p>
                  <p className="text-xs font-semibold text-slate-550 mt-0.5">support@ziplin.io</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50/80 flex items-center justify-center text-indigo-650 shrink-0">
                  <Phone className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Call Us</h4>
                  <p className="text-sm font-bold text-slate-900 mt-1">+1 (555) 234-5678</p>
                  <p className="text-xs font-semibold text-slate-550 mt-0.5">Mon-Fri · Toll-free</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50/80 flex items-center justify-center text-indigo-650 shrink-0">
                  <MapPin className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Our Headquarters</h4>
                  <p className="text-sm font-bold text-slate-900 mt-1">350 5th Ave, 12th Floor</p>
                  <p className="text-xs font-semibold text-slate-550 mt-0.5">New York, NY 10118</p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-900 text-white rounded-3xl p-8 shadow-md relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8 pointer-events-none" />

              <div className="flex items-center gap-3.5 mb-5 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Clock className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-lg font-extrabold tracking-tight">Business Hours</h3>
              </div>
              <div className="space-y-3.5 relative z-10 text-sm font-medium">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-indigo-200">Monday – Friday</span>
                  <span className="font-bold">9:00 AM – 6:00 PM (EST)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-200">Saturday – Sunday</span>
                  <span className="font-bold text-indigo-300">Closed</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-150 rounded-[2.5rem] p-10 text-center shadow-lg shadow-emerald-100/30 animate-fade-in h-full flex flex-col justify-center items-center min-h-[512px]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-550 text-white mb-6 shadow-md shadow-emerald-500/10">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">Message Sent Successfully!</h3>
                <p className="text-sm text-slate-650 font-semibold leading-relaxed max-w-md mx-auto">
                  Thank you for contacting us, {name}. We have received your query, and our support engineering team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-slate-200 shadow-2xl shadow-slate-100/30 rounded-[2.5rem] p-8 md:p-10 text-left space-y-6 h-full flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      placeholder="Sarah Chen"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 focus:bg-white transition-all placeholder-slate-450 font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      placeholder="sarah@brand.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 focus:bg-white transition-all placeholder-slate-450 font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 focus:bg-white transition-all font-semibold text-slate-700"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales & Business Development</option>
                      <option value="support">Technical Engineering Support</option>
                      <option value="abuse">Report Link Abuse</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message</label>
                    <textarea
                      placeholder="How can we help your team?"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 focus:bg-white transition-all placeholder-slate-450 font-semibold h-32 resize-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-4 px-6 py-3 bg-[#4f46e5] text-white hover:bg-[#4338ca] font-bold rounded-full text-sm transition-all shadow-md shadow-indigo-500/10"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="mt-24 border-t border-slate-200/60 pt-16 text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-indigo-650 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full">
              Our Location
            </span>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-4">
              Visit Ziplin Headquarters
            </h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              We are located in the heart of Midtown Manhattan. Pop in to discuss link infrastructure or say hello to our team.
            </p>
          </div>
          <div className="w-full h-[400px] rounded-[2.5rem] border border-slate-200 overflow-hidden relative shadow-lg group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617540960582!2d-73.98685832341498!3d40.74844047138908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Empire State Building, New York Map"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

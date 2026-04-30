import { useState, useRef, useEffect } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  ChevronDown, 
  Leaf, 
  MessageCircle,
  Camera,
  Users,
  GithubIcon 
} from "../utils/icons";
import SectionTitle from "../components/common/SectionTitle";

function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const faqs = [
  {
    q: "How long does it take to get a response?",
    a: "Our support team responds to all inquiries within 24 hours on business days. For urgent matters, please use the live chat option.",
  },
  {
    q: "Can I track the status of my support ticket?",
    a: "Yes! After submitting a message you'll receive a confirmation email with a ticket ID you can use to check your request's status.",
  },
  {
    q: "I have a partnership or press inquiry — who do I contact?",
    a: "For partnerships, press, or media inquiries please mention this in the Subject field and our partnerships team will be looped in automatically.",
  },
  {
    q: "Do you offer support for sellers with large catalogues?",
    a: "Absolutely. We have a dedicated seller success team for high-volume sellers. Select 'Seller Support' as your subject to reach them directly.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 dark:border-gray-800">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group cursor-pointer"
      >
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-300 ${open ? "rotate-180 text-green-600 dark:text-green-400" : ""}`}
        />
      </button>
      <div
        style={{
          maxHeight: open ? "200px" : "0",
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 pb-5 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

const contactInfo = [
  { icon: Mail, label: "Email us", value: "hello@ecofashion.co", href: "mailto:hello@ecofashion.co" },
  { icon: Phone, label: "Call us", value: "+1 (555) 820-4400", href: "tel:+15558204400" },
  { icon: MapPin, label: "Find us", value: "Cairo, Egypt 🇪🇬", href: "#" },
  { icon: Clock, label: "Support hours", value: "Mon–Fri, 9 am – 6 pm EET", href: null },
];

const socials = [
  { icon: MessageCircle, label: "Twitter", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Users, label: "LinkedIn", href: "#" },
  { icon: GithubIcon, label: "GitHub", href: "#" },
];

const subjects = [
  "General Inquiry",
  "Buyer Support",
  "Seller Support",
  "EcoCredits & Rewards",
  "Partnership / Press",
  "Bug Report",
  "Other",
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | done

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.subject || !form.message) return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("done");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent transition-all duration-200 text-sm";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-20 px-4 sm:px-6 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-15 dark:opacity-10"
          style={{ background: "radial-gradient(ellipse, #16a34a 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-2xl">
          <SectionTitle
            title="Get in touch"
            subtitle="Have a question, idea, or just want to say hello? We'd love to hear from you — our team typically replies within one business day."
            align="center"
            size="xl"
            className="mb-8"
          />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium">
            <MessageSquare className="w-3.5 h-3.5" />
            We're here to help
          </div>
        </div>
      </section>

      {/* ── Main grid ── */}
      <section className="py-8 pb-24 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">

          {/* Left – form */}
          <FadeIn className="lg:col-span-3">
            <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 shadow-sm p-8 sm:p-10">
              {status === "done" ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center mb-2">
                    <Leaf className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Message sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                    Thanks for reaching out. We'll get back to you within one business day.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 text-sm text-green-600 dark:text-green-400 font-medium hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <SectionTitle
                    title="Send us a message"
                    subtitle="All fields are required."
                    align="left"
                    size="md"
                    className="mb-4"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Your name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ada Lovelace"
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="ada@example.com"
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={inputBase + " cursor-pointer appearance-none"}
                    >
                      <option value="" disabled>Select a topic…</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us how we can help…"
                      className={inputBase + " resize-none"}
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={status === "sending"}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-green-200 dark:hover:shadow-green-950 hover:-translate-y-0.5 cursor-pointer"
                  >
                    {status === "sending" ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send message
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Right – contact info + socials */}
          <FadeIn delay={120} className="lg:col-span-2 flex flex-col gap-6">
            {/* Contact details */}
            <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-7 shadow-sm">
              <SectionTitle
              title="Contact details"
              align="left"
              size="sm"
              className="mb-5"
            />
              <div className="flex flex-col gap-4">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-green-50 dark:bg-green-950/40 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{label}</p>
                      {href && href !== "#" ? (
                        <a href={href} className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-7 shadow-sm">
              <SectionTitle
              title="Follow us"
              align="left"
              size="sm"
              className="mb-4"
            />
              <div className="flex gap-3 flex-wrap">
                {socials.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-green-400 dark:hover:border-green-600 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-4 leading-relaxed">
                Join our community online for sustainability tips, style inspiration, and platform updates.
              </p>
            </div>

            {/* Quick note */}
            <div className="rounded-3xl bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/40 dark:to-teal-950/40 border border-green-100 dark:border-green-900 p-7">
              <Leaf className="w-5 h-5 text-green-600 dark:text-green-400 mb-3" />
              <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">Response commitment</p>
              <p className="text-xs text-green-700 dark:text-green-500 leading-relaxed">
                We reply to every message within 24 hours on business days. Your question matters to us — we're a small team that genuinely cares.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-4 sm:px-6border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-2xl">
          <FadeIn className="text-center mb-12">
            <SectionTitle
              title="FAQ"
              subtitle="Common questions"
              align="center"
              size="lg"
            />
          </FadeIn>
          <FadeIn delay={80}>
            <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 px-8 py-2 shadow-sm">
              {faqs.map((item) => (
                <FAQItem key={item.q} {...item} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
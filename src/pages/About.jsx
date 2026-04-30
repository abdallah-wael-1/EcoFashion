import { Link } from "react-router-dom";
import { 
  Leaf, 
  Users, 
  ShieldCheck, 
  Recycle, 
  Zap, 
  Globe, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  TreePineIcon 
} from "../utils/icons";
import { useEffect, useRef, useState } from "react";
import SectionTitle from "../components/common/SectionTitle";

// Simple hook for fade-in on scroll
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
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
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const pillars = [
  {
    icon: Leaf,
    title: "Sustainability",
    desc: "Every swap, every sale keeps garments out of landfill — extending the life of fashion by years.",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/40",
    border: "border-green-100 dark:border-green-900",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Connect with tens of thousands of eco-conscious fashion lovers who share your values.",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/40",
    border: "border-teal-100 dark:border-teal-900",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    desc: "Verified sellers, quality ratings, and fully transparent reviews power every transaction.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-100 dark:border-emerald-900",
  },
];

const features = [
  {
    icon: Recycle,
    title: "Swap System",
    desc: "Trade pieces you no longer wear for styles you'll love — zero cash needed.",
  },
  {
    icon: Sparkles,
    title: "EcoCredits",
    desc: "Earn credits for every sustainable action and redeem them on future purchases.",
  },
  {
    icon: Globe,
    title: "Global Marketplace",
    desc: "Shop sustainable sellers from over 80 countries with transparent shipping footprints.",
  },
  {
    icon: Zap,
    title: "Upcycling Hub",
    desc: "Browse unique upcycled and handcrafted pieces from independent sustainable makers.",
  },
  {
    icon: Heart,
    title: "Conscious Curation",
    desc: "Every item is vetted for quality and condition so you only see the best.",
  },
  {
    icon: TreePineIcon,
    title: "Impact Tracking",
    desc: "See exactly how many kg of CO₂ and litres of water your wardrobe choices have saved.",
  },
];

const values = [
  { label: "Items Saved from Landfill", value: "2.4M+" },
  { label: "Active Community Members", value: "180K" },
  { label: "CO₂ Saved (tonnes)", value: "14,200" },
  { label: "Countries Reached", value: "80+" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-24 px-4 sm:px-6">
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full opacity-20 dark:opacity-10"
          style={{ background: "radial-gradient(circle, #16a34a 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full opacity-15 dark:opacity-10"
          style={{ background: "radial-gradient(circle, #0d9488 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium mb-8">
            <Leaf className="w-3.5 h-3.5" />
            Sustainable Fashion Reimagined
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-50 leading-tight tracking-tight mb-6">
            Fashion that's good for{" "}
            <span className="text-green-600 dark:text-green-400">you</span> and the{" "}
            <span className="text-teal-600 dark:text-teal-400">planet</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            EcoFashion is the marketplace where conscious consumers buy, sell, and swap quality fashion — earning EcoCredits and measurably reducing their environmental footprint.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-green-200 dark:hover:shadow-green-950 hover:-translate-y-0.5"
            >
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200 hover:-translate-y-0.5"
            >
              Browse marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 divide-y-2 md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
          {values.map(({ label, value }) => (
            <FadeIn key={label} className="text-center px-6 py-2">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Mission / Pillars ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <FadeIn className="text-center mb-14">
            <SectionTitle
              title="Our Pillars"
              subtitle="The core ideas behind our platform"
              align="center"
              size="lg"
            />
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map(({ icon: Icon, title, desc, color, bg, border }, i) => (
              <FadeIn key={title} delay={i * 100}>
                <div className={`group h-full rounded-3xl border ${border} ${bg} p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                  <div className={`inline-flex p-3 rounded-2xl bg-white dark:bg-gray-900 shadow-sm mb-5`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="py-24 px-4 sm:px-6  ">
        <div className="mx-auto max-w-5xl">
          <FadeIn className="text-center mb-14">
            <SectionTitle
              title="What We Offer"
              subtitle="Everything you need for conscious fashion"
              align="center"
              size="lg"
            />
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 80}>
                <div className="group h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-7 transition-all duration-300 hover:border-green-300 dark:hover:border-green-700 hover:shadow-lg hover:-translate-y-0.5">
                  <div className="inline-flex p-2.5 rounded-xl bg-green-50 dark:bg-green-950/40 mb-4">
                    <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values narrative ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <SectionTitle
              title="Our Story"
              subtitle="We started because fast fashion was winning"
              align="left"
              size="lg"
              className="mb-6"
            />
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
              In 2022, our founders watched 92 million tonnes of textile waste pile up — and decided the industry needed a radical alternative. EcoFashion was born as a direct response: a platform that makes sustainable choices as easy, beautiful, and rewarding as anything else on the market.
            </p>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Today we're a community of 180,000+ members across 80 countries, collectively saving millions of garments and tonnes of CO₂ every year. We're just getting started.
            </p>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Founded", value: "2022", sub: "Cairo, Egypt" },
                { label: "Team", value: "42", sub: "across 12 countries" },
                { label: "Items listed", value: "900K+", sub: "active listings" },
                { label: "Avg. item life", value: "+3.2 yrs", sub: "extended by resale" },
              ].map(({ label, value, sub }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6"
                >
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 sm:px-6">
        <FadeIn>
          <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-green-600 to-teal-600 dark:from-green-700 dark:to-teal-700 p-12 sm:p-16 text-center relative overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{ background: "radial-gradient(circle at 70% 30%, #fff 0%, transparent 60%)" }}
            />
            <Leaf className="w-10 h-10 text-white/60 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to dress sustainably?</h2>
            <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
              Join 180,000 members already building wardrobes that feel good — for every reason.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-white text-green-700 font-bold text-base hover:bg-green-50 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
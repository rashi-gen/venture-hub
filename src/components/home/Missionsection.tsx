import Link from "next/link";
import { Sprout, Sun, Users2, BarChart3, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Sprout,
    title: "Early-Stage Cultivation",
    description: "Tailored seed and pre-seed support for technical founders with an ethical north star.",
    bg: "bg-white",
    iconBg: "bg-[#1A362B]/5",
    iconColor: "text-[#1A362B]",
    titleColor: "text-[#1A362B]",
    descColor: "text-[#1A362B]/60",
    offset: false,
  },
  {
    icon: Sun,
    title: "Institutional Exposure",
    description: "Connect directly with institutional-grade capital that understands long-term value creation.",
    bg: "bg-[#1A362B]",
    iconBg: "bg-white/10",
    iconColor: "text-[#EFEBE3]",
    titleColor: "text-white",
    descColor: "text-white/60",
    offset: true,
  },
  {
    icon: Users2,
    title: "Master Mentorship",
    description: "Guidance from veterans who have successfully navigated the complexities of global scaling.",
    bg: "bg-white",
    iconBg: "bg-[#1A362B]/5",
    iconColor: "text-[#1A362B]",
    titleColor: "text-[#1A362B]",
    descColor: "text-[#1A362B]/60",
    offset: false,
  },
  {
    icon: BarChart3,
    title: "Sustainable Metrics",
    description: "Measuring success not just in growth, but in social and environmental resonance.",
    bg: "bg-[#EFEBE3]",
    iconBg: "bg-[#1A362B]/10",
    iconColor: "text-[#1A362B]",
    titleColor: "text-[#1A362B]",
    descColor: "text-[#1A362B]/60",
    offset: true,
  },
];

export function MissionSection() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-8 bg-[#EFEBE3]/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Sticky Content */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1A362B] mb-6 sm:mb-8 leading-tight">
                Our mission is to foster a symbiotic{" "}
                <span className="italic">ecosystem</span> where impact meets intelligence.
              </h2>
              <div className="space-y-4 sm:space-y-6 text-[#1A362B]/70 leading-relaxed text-base sm:text-lg">
                <p>
                  We believe that capital should be as visionary as the founders it supports.
                  Our platform isn't just a marketplace; it's a living greenhouse for ideas that
                  seek to heal, build, and progress our shared world.
                </p>
                <p>
                  By removing the friction between capital and mission, we empower the next
                  generation of architects to build something that lasts.
                </p>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-4 mt-8 sm:mt-12 text-[#1A362B] font-bold uppercase text-xs tracking-widest group"
              >
                Discover Our Roots{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Grid with Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {features.map(({ icon: Icon, title, description, bg, iconBg, iconColor, titleColor, descColor, offset }) => (
              <div
                key={title}
                className={`${bg} p-8 sm:p-12 shadow-sm border border-[#1A362B]/5 flex flex-col justify-between min-h-[280px] sm:h-[400px] ${
                  offset ? "sm:translate-y-8 lg:translate-y-12" : ""
                }`}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${iconBg} rounded-full flex items-center justify-center ${iconColor} mb-6 sm:mb-8`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className={`font-serif text-xl sm:text-2xl ${titleColor} mb-3 sm:mb-4`}>{title}</h3>
                  <p className={`${descColor} text-sm leading-relaxed`}>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
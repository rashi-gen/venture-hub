import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const visionaries = [
  {
    name: "Elara Vance",
    role: "Founder, Aeris Bio",
    bio: "Developing zero-waste agricultural solutions to empower rural communities across Southeast Asia.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    offset: false,
  },
  {
    name: "Dr. Marcus Chen",
    role: "GP, Meridian Capital",
    bio: "Focusing on deep-tech climate solutions that bridge the gap between academic research and commercial scale.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    offset: true,
  },
  {
    name: "Sienna Ross",
    role: "Principal, The Lattice",
    bio: "Guidance on organizational design for impact-driven organizations seeking rapid global expansion.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
    offset: false,
  },
];

export function VisionariesSection() {
  return (
    <section className="py-20 sm:py-40 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-20">
        <span className="text-[#1A362B]/40 font-bold uppercase tracking-[0.4em] text-[10px] block mb-3 sm:mb-4">
          The Collective
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl text-[#1A362B]">Featured Visionaries</h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
        {visionaries.map(({ name, role, bio, image, offset }) => (
          <Link
            href={`/visionaries/${name.toLowerCase().replace(/\s+/g, '-')}`}
            key={name}
            className={`group cursor-pointer ${offset ? "sm:translate-y-0 lg:-translate-y-12" : ""}`}
          >
            <div className="overflow-hidden mb-5 sm:mb-6 aspect-[4/5] bg-[#EFEBE3] relative">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#1A362B]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="px-1 sm:px-2">
              <h4 className="font-serif text-xl sm:text-2xl text-[#1A362B] mb-1">{name}</h4>
              <p className="text-xs font-bold uppercase tracking-widest text-[#1A362B]/40 mb-3 sm:mb-4">{role}</p>
              <p className="text-[#1A362B]/60 leading-relaxed text-sm">{bio}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center mt-12 sm:mt-20">
        <Link
          href="/visionaries"
          className="inline-flex items-center gap-2 text-[#1A362B] font-bold uppercase text-xs tracking-widest hover:gap-4 transition-all"
        >
          View All Visionaries
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
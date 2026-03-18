import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 sm:py-40 px-4 sm:px-8 relative overflow-hidden">
      {/* Dark Background */}
      <div className="absolute inset-0 bg-[#1A362B] -z-10" />
      
      {/* Decorative Organic Blob */}
      <div className="absolute top-0 right-0 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-white mb-6 sm:mb-10 leading-tight">
          Ready to plant the seeds of your{" "}
          <span className="italic font-normal">legacy?</span>
        </h2>
        <p className="text-white/60 text-base sm:text-xl max-w-2xl mx-auto mb-10 sm:mb-16 font-light leading-relaxed">
          Join a curated collective where purpose meets precision. We are now accepting
          applications for the 2024 Growth Cohort.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link
            href="/apply"
            className="w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 bg-white text-[#1A362B] font-bold uppercase text-xs tracking-widest shadow-2xl hover:bg-[#EFEBE3] transition-colors text-center"
          >
            Apply for Capital
          </Link>
          <Link
            href="/mentorship"
            className="w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 border border-white/20 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-colors text-center"
          >
            Become a Mentor
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto mt-16 sm:mt-24">
          <div>
            <div className="font-serif text-3xl sm:text-4xl text-white mb-2">$42M+</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Deployed</div>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl text-white mb-2">240%</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Avg. Growth</div>
          </div>
        </div>
      </div>
    </section>
  );
}
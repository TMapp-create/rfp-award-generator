
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const LandingHero = () => (
  <section className="flex flex-col justify-center items-center py-24 gap-8 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="w-[60vw] h-[60vw] bg-indigo-500 opacity-20 blur-3xl rounded-full absolute -top-32 left-1/2 -translate-x-1/2"></div>
    </div>
    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary mb-3 z-10 animate-fade-in">
      Effortless RFPs<br/>
      <span className="text-indigo-500"> Powered by AI</span>
    </h1>
    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-6 z-10 animate-fade-in">
      Transform how you manage proposals. Instantly generate, review, and manage RFPs with smart AI tools.
      Focus on what matters: <span className="font-semibold text-primary">winning business</span>.
    </p>
    <div className="flex gap-4 z-10 animate-scale-in">
      <Button size="lg" className="rounded-full px-8 py-5 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition">
        Get Started Free
        <ArrowRight size={22} className="ml-2" />
      </Button>
    </div>
    <div className="mt-8 flex flex-col items-center gap-2">
      <span className="text-sm text-muted-foreground">No credit card required · Quick onboarding</span>
    </div>
  </section>
);

export default LandingHero;

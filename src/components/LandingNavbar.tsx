
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingNavbar = () => (
  <nav className="w-full flex justify-between items-center pt-6 pb-4 px-10 border-b bg-background/80 sticky top-0 z-30">
    <div className="flex items-center gap-2">
      <span className="text-xl font-extrabold tracking-wide text-primary hover:scale-105 transition-transform duration-150 cursor-pointer">AI RFP SaaS</span>
    </div>
    <div className="flex gap-4 items-center">
      <Button variant="ghost" className="text-base font-medium hover:underline underline-offset-2 px-4">Why Us?</Button>
      <Button variant="ghost" className="text-base font-medium hover:underline underline-offset-2 px-4">Features</Button>
      <Button className="gap-2 px-5 font-semibold shadow transition hover:scale-105" size="lg">
        <LogIn size={20} /> Sign Up / Log In
      </Button>
    </div>
  </nav>
);

export default LandingNavbar;

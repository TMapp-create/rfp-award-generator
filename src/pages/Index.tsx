
// High-impact, desktop-first landing page for the AI RFP SaaS for Business Owners.

import LandingNavbar from "@/components/LandingNavbar";
import LandingHero from "@/components/LandingHero";
import FeaturesSection from "@/components/FeaturesSection";

const Index = () => (
  <div className="w-full min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
    <LandingNavbar />
    <main className="flex-1 w-full">
      <LandingHero />
      <FeaturesSection />
      <section className="w-full py-16 bg-background border-t">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h3 className="text-2xl font-semibold mb-4 text-primary">Ready to Modernize Your RFP Process?</h3>
          <p className="text-lg text-muted-foreground mb-6">
            Join forward-thinking business owners using AI to win more business, save time, and impress clients without the headaches.
          </p>
          <div className="flex justify-center">
            <a href="#" className="inline-block">
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow hover:bg-indigo-700 transition animate-scale-in">
                Get Started in Minutes
              </button>
            </a>
          </div>
        </div>
      </section>
      <footer className="border-t py-6 text-center text-muted-foreground">
        &copy; {new Date().getFullYear()} AI RFP SaaS &mdash; Empowering Business Success
      </footer>
    </main>
  </div>
);

export default Index;

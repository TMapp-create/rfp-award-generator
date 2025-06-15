
import { Zap, FileText, ShieldCheck, Timer, Users } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: <Zap size={36} strokeWidth={2.2} />,
    title: "AI-Powered Generation",
    description: "Create perfect RFPs in seconds with advanced AI that tailors content to your needs.",
  },
  {
    icon: <FileText size={36} strokeWidth={2.2} />,
    title: "Document Management",
    description: "Organize, review, and version all your RFPs in one secure place.",
  },
  {
    icon: <ShieldCheck size={36} strokeWidth={2.2} />,
    title: "Secure & Compliant",
    description: "Your data is encrypted and protected to meet business compliance standards.",
  },
  {
    icon: <Timer size={36} strokeWidth={2.2} />,
    title: "Lightning Fast Turnaround",
    description: "Reduce proposal workflow time from days to minutes. Win more deals, faster.",
  },
  {
    icon: <Users size={36} strokeWidth={2.2} />,
    title: "Team Collaboration",
    description: "Collaborate, comment, and manage permissions for your whole team.",
  },
];

const FeaturesSection = () => (
  <section className="w-full py-16 bg-muted">
    <div className="max-w-6xl mx-auto px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">Why Successful Businesses Use Our AI RFP SaaS</h2>
      <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
        From intuitive AI to robust security, our platform gives your business every advantage in today’s RFP-driven world.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;

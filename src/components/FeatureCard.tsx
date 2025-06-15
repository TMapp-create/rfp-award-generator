
import { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="flex flex-col items-center px-6 py-8 bg-background border rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 animate-fade-in group">
    <div className="mb-4 text-indigo-600 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-lg font-semibold mb-2 text-primary">{title}</h3>
    <p className="text-base text-muted-foreground text-center">{description}</p>
  </div>
);

export default FeatureCard;

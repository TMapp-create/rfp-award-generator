
import { LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LandingNavbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="w-full flex justify-between items-center pt-6 pb-4 px-10 border-b bg-background/80 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <span className="text-xl font-extrabold tracking-wide text-primary hover:scale-105 transition-transform duration-150 cursor-pointer">AI RFP SaaS</span>
      </div>
      <div className="flex gap-4 items-center">
        <Button variant="ghost" className="text-base font-medium hover:underline underline-offset-2 px-4">Why Us?</Button>
        <Button variant="ghost" className="text-base font-medium hover:underline underline-offset-2 px-4">Features</Button>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 px-5 font-semibold">
                <User size={20} />
                {user.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut size={16} className="mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            className="gap-2 px-5 font-semibold shadow transition hover:scale-105" 
            size="lg"
            onClick={() => navigate("/auth")}
          >
            <LogIn size={20} /> Sign Up / Log In
          </Button>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar;

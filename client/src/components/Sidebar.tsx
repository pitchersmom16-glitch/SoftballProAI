import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Users, 
  Video, 
  Dumbbell, 
  LogOut, 
  ShieldCheck,
  Menu,
  X,
  Brain
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Athletes', href: '/athletes', icon: Users },
    { name: 'Assessments', href: '/assessments', icon: Video },
    { name: 'Drills', href: '/drills', icon: Dumbbell },
    { name: 'Teams', href: '/teams', icon: ShieldCheck },
    { name: 'Train Brain', href: '/admin/train-brain', icon: Brain },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
          <span className="text-neon-green text-2xl">◆</span> 
          SoftballProAI
        </h1>
        {user && (
          <div className="mt-4 flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="h-10 w-10 rounded-full bg-neon-green/20 text-neon-green flex items-center justify-center font-bold text-lg">
              {user.firstName?.[0] || 'C'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate text-white">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-400 truncate">Coach</p>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? 'bg-neon-green/20 text-neon-green shadow-lg shadow-neon-green/20' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-neon-green' : 'text-gray-500'}`} />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-white/10 z-40 flex items-center justify-between px-4">
        <span className="text-xl font-bold font-display text-white flex items-center gap-2"><span className="text-neon-green">◆</span> SoftballProAI</span>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r border-white/10 w-80 bg-black">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed inset-y-0 flex-col w-72 bg-black border-r border-white/10 z-50">
        <NavContent />
      </div>

      {/* Main Content Spacer for Mobile */}
      <div className="lg:hidden h-16" />
    </>
  );
}

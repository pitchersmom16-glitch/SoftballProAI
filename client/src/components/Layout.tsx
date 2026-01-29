import { Sidebar } from "./Sidebar";
import { NotificationBell } from "./NotificationBell";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [location] = useLocation();
  const isLanding = !isAuthenticated && location === "/";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // If on landing page (public), don't show sidebar
  if (isLanding) {
    return <main className="min-h-screen bg-white">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {isAuthenticated && <Sidebar />}
      <div className={`lg:pl-72 transition-all duration-300 min-h-screen`}>
        {isAuthenticated && user?.role && (
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="font-medium capitalize">{user.role?.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = '/api/logout'}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </header>
        )}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

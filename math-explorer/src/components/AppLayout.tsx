import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X, Map as MapIcon, LayoutDashboard, Info, Star, Eye, EyeOff } from "lucide-react";
import { useStars } from "@/hooks/useStars";
import { useFocusMode } from "@/hooks/useFocusMode";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { to: "/", label: "Mission Map", icon: MapIcon },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/product", label: "About", icon: Info },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { stars } = useStars();
  const { focusMode, toggleFocusMode } = useFocusMode();

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-full focus:font-bold focus:shadow-lg transition-all"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md transition-all duration-300">
        <nav className="container max-w-5xl flex items-center justify-between h-16 px-6">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 flex-shrink-0"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              ∑
            </div>
            <span className="hidden sm:inline">MathOdyssey</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Focus Mode Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFocusMode}
                  className={cn(
                    "rounded-full w-9 h-9 transition-colors",
                    focusMode ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-muted"
                  )}
                  aria-label={focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
                  aria-pressed={focusMode}
                >
                  {focusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Star Counter */}
            <div
              className="flex items-center gap-1.5 bg-accent/20 px-3 py-1.5 rounded-full border border-accent/20"
              role="status"
              aria-label={`You have collected ${stars} stars`}
            >
              <Star className="w-4 h-4 text-accent-foreground fill-accent-foreground animate-pulse" />
              <span className="text-sm font-bold text-accent-foreground">{stars}</span>
            </div>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                        location.pathname === item.to
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:bg-muted rounded-md"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-background px-6 py-4 space-y-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    location.pathname === item.to
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
        {children}
      </main>

      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        MathOdyssey -- Visual Game-Based Math Learning for Autism
      </footer>
    </div>
  );
}

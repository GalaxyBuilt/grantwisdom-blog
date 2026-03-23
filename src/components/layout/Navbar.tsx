import { useState, useEffect } from "react";
import { Search, Menu, X, Sprout, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const navLinks = [
  { href: "/blog/", label: "Blog Home" },
  { href: "https://grantwisdom.com/grants", label: "Search Grants" },
  { href: "https://grantwisdom.com/pricing", label: "Pricing" },
  { href: "https://grantwisdom.com/about", label: "About" },
];

export function Navbar() {
  const [pathname, setPathname] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setPathname(window.location.pathname);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="/blog/" className="flex items-center gap-2 font-semibold text-foreground hover:opacity-80 transition-opacity">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <Sprout className="h-4 w-4 text-white" />
          </div>
          <span>GrantWisdom</span>
          <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-md font-medium text-muted-foreground ml-1">BETA</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                pathname === link.href
                  ? "text-foreground font-medium bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a href="https://grantwisdom.com/dashboard">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </a>
          <a href="https://grantwisdom.com/grants">
            <Button size="sm">
              <Search className="h-3.5 w-3.5" />
              Search Grants
            </Button>
          </a>
        </div>

        {/* Mobile menu btn */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === link.href
                  ? "text-foreground font-medium bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <a href="https://grantwisdom.com/dashboard" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full">Dashboard</Button>
            </a>
            <a href="https://grantwisdom.com/grants" onClick={() => setMobileOpen(false)}>
              <Button className="w-full">Search Grants</Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

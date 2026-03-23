import { useState, useEffect } from "react";
import { Search, Menu, X, Sprout, Moon, Sun, Twitter } from "lucide-react";
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
          <a href="https://x.com/grantwisdomapp" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" aria-label="X (Twitter)">
            <Twitter className="h-4 w-4" />
          </a>
          <a href="https://www.reddit.com/user/GrantHelper/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" aria-label="Reddit">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.248-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.561-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .466c.804.803 2.285.894 2.947.894.661 0 2.143-.09 2.946-.894a.33.33 0 0 0 0-.466.327.327 0 0 0-.466 0c-.465.466-1.564.532-2.48.532-.916 0-2.015-.066-2.48-.532a.327.327 0 0 0-.236-.094z" /></svg>
          </a>
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

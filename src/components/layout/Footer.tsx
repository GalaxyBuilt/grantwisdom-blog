import { Sprout } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <Sprout className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">GrantWisdom</span>
              <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-md font-medium text-muted-foreground ml-1">BETA</span>
            </a>
            <p className="text-muted-foreground text-sm">
              Discover and manage grants worldwide with our comprehensive platform.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="/grants" className="text-muted-foreground hover:text-accent text-sm transition-colors">
                  Grants
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-muted-foreground hover:text-accent text-sm transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/features" className="text-muted-foreground hover:text-accent text-sm transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-accent text-sm transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/blog" className="text-muted-foreground hover:text-accent text-sm transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-accent text-sm transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-accent text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-accent text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-start gap-1">
            <p className="text-muted-foreground text-sm">
              © {currentYear} GrantWisdom (BETA). All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Powered by <a href="https://EverRank.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">EverRank</a> 
              <span className="mx-1">•</span> 
              Built by <a href="https://Galaxybuilt.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">GalaxyBuilt</a>
            </p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

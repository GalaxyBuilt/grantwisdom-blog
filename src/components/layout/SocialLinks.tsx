import { Twitter, Youtube, Instagram } from "lucide-react";

export const SocialLinks = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <a href="https://x.com/grantwisdomapp" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
        <span className="sr-only">X (Twitter)</span>
        <Twitter className="h-5 w-5" />
      </a>
      <a href="https://www.youtube.com/@GrantWisdomApp" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
        <span className="sr-only">YouTube</span>
        <Youtube className="h-5 w-5" />
      </a>
      <a href="https://www.tiktok.com/@grantwisdom" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
        <span className="sr-only">TikTok</span>
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.63-.58 3.25-1.6 4.45-1.03 1.2-2.5 1.94-4.08 2.1-1.58.15-3.21-.1-4.57-.9-1.35-.8-2.38-2.07-2.84-3.57-.45-1.5-.32-3.15.35-4.55.67-1.4 1.83-2.54 3.23-3.14 1.39-.6 3.04-.63 4.46-.07V9.62c-.08-.02-.17-.03-.26-.03-2.34-.02-4.66.7-6.52 2.05-1.85 1.35-3.13 3.32-3.6 5.6-.46 2.27-.08 4.67 1.05 6.64 1.13 1.97 2.94 3.4 5.08 4.02 2.13.62 4.46.36 6.38-.72 1.92-1.07 3.33-2.84 3.96-4.96.63-2.11.45-4.42-.5-6.38-.95-1.95-2.6-3.48-4.64-4.3V.02z" /></svg>
      </a>
      <a href="https://www.instagram.com/grantwisdomapp" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
        <span className="sr-only">Instagram</span>
        <Instagram className="h-5 w-5" />
      </a>
      <a href="https://www.reddit.com/user/GrantHelper/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
        <span className="sr-only">Reddit</span>
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.248-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.561-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .466c.804.803 2.285.894 2.947.894.661 0 2.143-.09 2.946-.894a.33.33 0 0 0 0-.466.327.327 0 0 0-.466 0c-.465.466-1.564.532-2.48.532-.916 0-2.015-.066-2.48-.532a.327.327 0 0 0-.236-.094z" /></svg>
      </a>
    </div>
  );
};

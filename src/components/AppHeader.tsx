import { Link, useLocation } from "react-router-dom";
import { Search, BookOpen, Bookmark } from "lucide-react";

const navItems = [
  { to: "/", label: "Search", icon: Search },
  { to: "/methodology", label: "Methodology", icon: BookOpen },
  { to: "/saved", label: "Saved items", icon: Bookmark },
];

export function AppHeader() {
  const location = useLocation();

  return (
    <header className="spf-header" role="banner">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 text-header-foreground no-underline">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center" aria-hidden="true">
            <Search className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="font-semibold text-base">Service Pattern Finder</span>
          </div>
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex gap-1 list-none m-0 p-0">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm no-underline transition-colors ${
                      active
                        ? "bg-primary/20 text-primary-foreground font-medium"
                        : "text-header-foreground/80 hover:text-header-foreground hover:bg-primary/10"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="spf-notice container !rounded-none !border-x-0 text-center text-xs py-1.5">
        Unofficial research tool — not a government service
      </div>
    </header>
  );
}

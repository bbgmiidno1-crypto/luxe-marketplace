import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, Package, Search, User, X } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

const accountLinks = [
  { label: 'Wishlist', icon: Heart },
  { label: 'My Orders', icon: Package },
  { label: 'Account', icon: User },
];

const linkClass =
  'inline-flex items-center gap-2 text-sm text-ivory-300 transition hover:text-gold-300';

interface NavbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function Navbar({ searchValue, onSearchChange }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Search filters the product list as the user types.
  // Submitting the form (Enter) only scrolls to the product section.
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    document.getElementById('featured')?.scrollIntoView({ block: 'start' });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gold-400/15 bg-onyx-950/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="rounded-md p-2 text-ivory-200 transition hover:text-gold-300 md:hidden"
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            <Link to="/" aria-label="Go to home">
              <BrandLogo variant="full" size="sm" />
            </Link>
          </div>

          <nav aria-label="Account" className="hidden items-center gap-6 md:flex">
            {accountLinks.map(({ label, icon: Icon }) => (
              <a key={label} href="#" className={linkClass}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </a>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSearch} role="search" className="pb-3">
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>

          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-400"
              aria-hidden="true"
            />
            <input
              id="site-search"
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search products, brands and more"
              className="w-full rounded-md border border-gold-400/20 bg-onyx-900 py-2.5 pl-10 pr-4 text-sm text-ivory-100 placeholder:text-ivory-400 transition focus:border-gold-400/60 focus:outline-none"
            />
          </div>
        </form>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile menu"
          className="border-t border-gold-400/10 bg-onyx-900 md:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            <li>
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm text-ivory-100"
              >
                Home
              </Link>
            </li>

            {accountLinks.map(({ label, icon: Icon }) => (
              <li key={label}>
                <a href="#" className="flex items-center gap-3 py-3 text-sm text-ivory-300">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                  <span className="ml-auto text-[10px] uppercase tracking-wider text-ivory-400">
                    Soon
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

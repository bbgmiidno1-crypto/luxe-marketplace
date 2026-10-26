import { Clock, Mail, Phone } from 'lucide-react';
import { brand } from '../../config/brand';
import BrandLogo from '../common/BrandLogo';

const shopLinks = ['New Arrivals', 'Bestsellers', 'Under ₹999', 'All Categories'];
const helpLinks = ['Track Order', 'Cash on Delivery', 'Returns & Exchanges', 'FAQs'];
const policyLinks = ['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Shipping Policy'];

interface FooterColumnProps {
  title: string;
  links: string[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
        {title}
      </h4>
      <ul className="space-y-3 text-sm text-ivory-300">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="transition hover:text-gold-300">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gold-400/20 bg-onyx-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div className="space-y-4">
          <BrandLogo variant="full" size="md" />
          <p className="max-w-xs text-sm leading-relaxed text-ivory-400">{brand.tagline}</p>
        </div>

        <FooterColumn title="Shop" links={shopLinks} />
        <FooterColumn title="Help" links={helpLinks} />

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-ivory-300">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              <span>{brand.supportEmail}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              <span>{brand.supportPhone}</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              <span>{brand.supportHours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold-400/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-ivory-400 md:flex-row md:items-center md:justify-between md:px-6">
          <p>
            © {year} {brand.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {policyLinks.map((link) => (
              <a key={link} href="#" className="transition hover:text-gold-300">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
              }

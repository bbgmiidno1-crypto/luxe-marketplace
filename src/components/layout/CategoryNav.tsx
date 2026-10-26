import { useState } from 'react';
import { categories } from '../../data/categories';

const allItem = { id: 'all', label: 'All', emoji: '✨' };
const items = [allItem, ...categories];

/**
 * Horizontal category row. Selecting a category only changes the highlight.
 * Real filtering is added in Part 2 with Supabase data.
 */
export default function CategoryNav() {
  const [activeId, setActiveId] = useState('all');

  return (
    <nav
      id="categories"
      aria-label="Product categories"
      className="scroll-mt-28 border-b border-gold-400/15 bg-onyx-950"
    >
      <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 md:px-6">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveId(item.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition duration-200 ${
                active
                  ? 'border-gold-400 bg-gold-400 font-semibold text-onyx-950'
                  : 'border-gold-400/20 text-ivory-300 hover:border-gold-400/60 hover:text-gold-300'
              }`}
            >
              <span aria-hidden="true">{item.emoji}</span>
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

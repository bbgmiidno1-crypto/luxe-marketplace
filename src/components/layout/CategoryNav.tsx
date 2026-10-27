import type { CatalogueCategory } from '../../lib/catalogue';

interface CategoryNavProps {
  categories: CatalogueCategory[];
  /** null means "All categories". */
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
}

interface ChipProps {
  label: string;
  emoji?: string;
  active: boolean;
  onClick: () => void;
}

function Chip({ label, emoji, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition duration-200 ${
        active
          ? 'border-gold-400 bg-gold-400 font-semibold text-onyx-950'
          : 'border-gold-400/20 text-ivory-300 hover:border-gold-400/60 hover:text-gold-300'
      }`}
    >
      {emoji && <span aria-hidden="true">{emoji}</span>}
      {label}
    </button>
  );
}

/** Horizontal category row. Selecting a chip filters the product list by category slug. */
export default function CategoryNav({ categories, activeSlug, onSelect }: CategoryNavProps) {
  return (
    <nav
      id="categories"
      aria-label="Product categories"
      className="scroll-mt-28 border-b border-gold-400/15 bg-onyx-950"
    >
      <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 md:px-6">
        <Chip
          label="All"
          emoji="✨"
          active={activeSlug === null}
          onClick={() => onSelect(null)}
        />

        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            active={activeSlug === category.slug}
            onClick={() => onSelect(category.slug)}
          />
        ))}
      </div>
    </nav>
  );
}

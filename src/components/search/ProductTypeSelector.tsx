import { type TaxonomyOption } from "@/config/taxonomy";

interface ProductTypeSelectorProps {
  options: TaxonomyOption[];
  selected: string;
  onSelect: (id: string) => void;
  otherText: string;
  onOtherTextChange: (text: string) => void;
}

export function ProductTypeSelector({ options, selected, onSelect, otherText, onOtherTextChange }: ProductTypeSelectorProps) {
  return (
    <fieldset>
      <legend className="spf-section-title">1. What type of service or product?</legend>
      <p className="text-sm text-muted-foreground mb-4">Choose the category that best describes what you're looking for.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="radiogroup">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={selected === opt.id}
            onClick={() => onSelect(opt.id)}
            className={`spf-card text-left cursor-pointer ${
              selected === opt.id ? "ring-2 ring-primary border-primary" : ""
            }`}
          >
            <div className="font-medium text-sm">{opt.label}</div>
            {opt.description && <div className="text-xs text-muted-foreground mt-1">{opt.description}</div>}
          </button>
        ))}
      </div>
      {selected === "other" && (
        <div className="mt-3">
          <label htmlFor="other-product-type" className="block text-sm font-medium mb-1">
            Describe the product type
          </label>
          <input
            id="other-product-type"
            type="text"
            value={otherText}
            onChange={(e) => onOtherTextChange(e.target.value)}
            placeholder="e.g. citizen feedback platform"
            className="w-full px-3 py-2 rounded-md border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}
    </fieldset>
  );
}

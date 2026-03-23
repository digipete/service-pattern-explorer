import { type TaxonomyOption } from "@/config/taxonomy";

interface ChipMultiSelectProps {
  legend: string;
  description?: string;
  options: TaxonomyOption[];
  selected: string[];
  onToggle: (id: string) => void;
}

export function ChipMultiSelect({ legend, description, options, selected, onToggle }: ChipMultiSelectProps) {
  return (
    <fieldset>
      <legend className="spf-section-title">{legend}</legend>
      {description && <p className="text-sm text-muted-foreground mb-3">{description}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => onToggle(opt.id)}
              className={`spf-chip ${isSelected ? "spf-chip-selected" : "spf-chip-unselected"}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

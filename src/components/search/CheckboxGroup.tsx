import { type TaxonomyOption } from "@/config/taxonomy";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxGroupProps {
  legend: string;
  description?: string;
  options: TaxonomyOption[];
  selected: string[];
  onToggle: (id: string) => void;
}

export function CheckboxGroup({ legend, description, options, selected, onToggle }: CheckboxGroupProps) {
  return (
    <fieldset>
      <legend className="spf-section-title">{legend}</legend>
      {description && <p className="text-sm text-muted-foreground mb-3">{description}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
        {options.map((opt) => (
          <div key={opt.id} className="flex items-center gap-2">
            <Checkbox
              id={`cap-${opt.id}`}
              checked={selected.includes(opt.id)}
              onCheckedChange={() => onToggle(opt.id)}
            />
            <Label htmlFor={`cap-${opt.id}`} className="text-sm cursor-pointer">
              {opt.label}
            </Label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

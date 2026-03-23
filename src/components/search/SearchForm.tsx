import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  productTypes, userGroups, capabilities, painPoints, domainHints,
  resultLimitOptions, type ResultLimit, type ResultMode,
} from "@/config/taxonomy";
import { buildQueries, type SearchFormData } from "@/lib/queryBuilder";
import { addRecentSearch } from "@/lib/storage";
import { ProductTypeSelector } from "./ProductTypeSelector";
import { ChipMultiSelect } from "./ChipMultiSelect";
import { CheckboxGroup } from "./CheckboxGroup";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Check } from "lucide-react";

const TOTAL_STEPS = 7;

const stepLabels = [
  "Service type",
  "Users",
  "Capabilities",
  "Pain points",
  "Domain",
  "Context",
  "Options",
];

export function SearchForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [productType, setProductType] = useState("");
  const [productTypeOther, setProductTypeOther] = useState("");
  const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [limit, setLimit] = useState<ResultLimit>(10);
  const [resultMode, setResultMode] = useState<ResultMode>("snippets");

  const toggle = useCallback(
    (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
      setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
    },
    []
  );

  const canSubmit = productType !== "" && (productType !== "other" || productTypeOther.trim() !== "");
  const canProceedFromStep0 = productType !== "" && (productType !== "other" || productTypeOther.trim() !== "");

  const handleSubmit = () => {
    if (!canSubmit) return;
    const formData: SearchFormData = {
      productType,
      productTypeOther,
      selectedUserGroups,
      selectedCapabilities,
      selectedPainPoints,
      selectedDomains,
      freeText,
    };
    const queries = buildQueries(formData);
    addRecentSearch({
      query: queries.primary,
      timestamp: new Date().toISOString(),
      productType: productTypes.find((p) => p.id === productType)?.label ?? productType,
    });
    navigate("/results", { state: { formData, queries, limit, resultMode } });
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };
  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <ProductTypeSelector
            options={productTypes}
            selected={productType}
            onSelect={setProductType}
            otherText={productTypeOther}
            onOtherTextChange={setProductTypeOther}
          />
        );
      case 1:
        return (
          <ChipMultiSelect
            legend="Who uses this service?"
            description="Select the primary user groups. Optional but improves results."
            options={userGroups}
            selected={selectedUserGroups}
            onToggle={(id) => toggle(selectedUserGroups, setSelectedUserGroups, id)}
          />
        );
      case 2:
        return (
          <CheckboxGroup
            legend="What capabilities or features?"
            description="Select relevant features to refine your search."
            options={capabilities}
            selected={selectedCapabilities}
            onToggle={(id) => toggle(selectedCapabilities, setSelectedCapabilities, id)}
          />
        );
      case 3:
        return (
          <ChipMultiSelect
            legend="Pain points or delivery challenges"
            description="What problems is the service trying to solve? Optional."
            options={painPoints}
            selected={selectedPainPoints}
            onToggle={(id) => toggle(selectedPainPoints, setSelectedPainPoints, id)}
          />
        );
      case 4:
        return (
          <ChipMultiSelect
            legend="Domain hints"
            description="Optionally narrow results to a specific policy area."
            options={domainHints}
            selected={selectedDomains}
            onToggle={(id) => toggle(selectedDomains, setSelectedDomains, id)}
          />
        );
      case 5:
        return (
          <fieldset>
            <legend className="spf-section-title">Additional context</legend>
            <label htmlFor="free-text" className="block text-sm text-muted-foreground mb-2">
              Add any extra context, service language, or implementation details that should shape the search.
            </label>
            <textarea
              id="free-text"
              rows={4}
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="e.g. citizen-facing service for submitting evidence and tracking a case"
              className="w-full px-3 py-2 rounded-md border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
            />
          </fieldset>
        );
      case 6:
        return (
          <fieldset>
            <legend className="spf-section-title">Search options</legend>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Results limit</label>
                <div className="flex gap-2">
                  {resultLimitOptions.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLimit(l)}
                      className={`px-4 py-2 rounded-md text-sm border transition-colors ${
                        limit === l
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Result detail</label>
                <div className="flex gap-2">
                  {(["minimal", "snippets", "full"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setResultMode(m)}
                      className={`px-4 py-2 rounded-md text-sm border capitalize transition-colors ${
                        resultMode === m
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>
        );
      default:
        return null;
    }
  };

  const isLastStep = step === TOTAL_STEPS - 1;
  const isFirstStep = step === 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isLastStep) handleSubmit();
        else next();
      }}
      className="space-y-6"
    >
      {/* Progress bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Step {step + 1} of {TOTAL_STEPS}
            <span className="text-muted-foreground ml-2">— {stepLabels[step]}</span>
          </span>
          {step > 0 && (
            <span className="text-xs text-muted-foreground">
              {selectedUserGroups.length + selectedCapabilities.length + selectedPainPoints.length + selectedDomains.length} filters selected
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (i === 0 || canProceedFromStep0) setStep(i);
              }}
              disabled={i > 0 && !canProceedFromStep0}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-border"
              } ${i > 0 && !canProceedFromStep0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"}`}
              aria-label={`Go to step ${i + 1}: ${stepLabels[i]}`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[280px]">{renderStep()}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          {!isFirstStep && (
            <Button type="button" variant="outline" onClick={prev} className="gap-1.5">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!isLastStep && step > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="text-muted-foreground"
            >
              Skip to search
            </Button>
          )}
          {isLastStep ? (
            <Button type="submit" disabled={!canSubmit} size="lg" className="gap-2">
              <Search className="w-4 h-4" />
              Find similar patterns
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isFirstStep && !canProceedFromStep0}
              className="gap-1.5"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {isFirstStep && !canProceedFromStep0 && (
        <p className="text-sm text-muted-foreground">Select a product type to continue.</p>
      )}
    </form>
  );
}

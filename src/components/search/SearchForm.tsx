import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { productTypes, userGroups, capabilities, painPoints, domainHints, resultLimitOptions, type ResultLimit, type ResultMode } from "@/config/taxonomy";
import { buildQueries, type SearchFormData } from "@/lib/queryBuilder";
import { addRecentSearch } from "@/lib/storage";
import { ProductTypeSelector } from "./ProductTypeSelector";
import { ChipMultiSelect } from "./ChipMultiSelect";
import { CheckboxGroup } from "./CheckboxGroup";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

export function SearchForm() {
  const navigate = useNavigate();
  const [productType, setProductType] = useState("");
  const [productTypeOther, setProductTypeOther] = useState("");
  const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [limit, setLimit] = useState<ResultLimit>(10);
  const [resultMode, setResultMode] = useState<ResultMode>("snippets");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggle = useCallback((list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
    setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
  }, []);

  const canSubmit = productType !== "" && (productType !== "other" || productTypeOther.trim() !== "");

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

    const state = { formData, queries, limit, resultMode };
    navigate("/results", { state });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-8"
    >
      <ProductTypeSelector
        options={productTypes}
        selected={productType}
        onSelect={setProductType}
        otherText={productTypeOther}
        onOtherTextChange={setProductTypeOther}
      />

      <ChipMultiSelect
        legend="2. Who uses this service?"
        description="Select the primary user groups. Optional but improves results."
        options={userGroups}
        selected={selectedUserGroups}
        onToggle={(id) => toggle(selectedUserGroups, setSelectedUserGroups, id)}
      />

      <CheckboxGroup
        legend="3. What capabilities or features?"
        description="Select relevant features to refine your search."
        options={capabilities}
        selected={selectedCapabilities}
        onToggle={(id) => toggle(selectedCapabilities, setSelectedCapabilities, id)}
      />

      <ChipMultiSelect
        legend="4. Pain points or delivery challenges"
        description="What problems is the service trying to solve? Optional."
        options={painPoints}
        selected={selectedPainPoints}
        onToggle={(id) => toggle(selectedPainPoints, setSelectedPainPoints, id)}
      />

      <ChipMultiSelect
        legend="5. Domain hints"
        description="Optionally narrow results to a specific policy area."
        options={domainHints}
        selected={selectedDomains}
        onToggle={(id) => toggle(selectedDomains, setSelectedDomains, id)}
      />

      <fieldset>
        <legend className="spf-section-title">6. Additional context</legend>
        <label htmlFor="free-text" className="block text-sm text-muted-foreground mb-2">
          Add any extra context, service language, or implementation details that should shape the search.
        </label>
        <textarea
          id="free-text"
          rows={3}
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="e.g. citizen-facing service for submitting evidence and tracking a case"
          className="w-full px-3 py-2 rounded-md border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
        />
      </fieldset>

      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Search options
        </button>
        {showAdvanced && (
          <div className="mt-3 flex flex-wrap gap-6 animate-fade-in">
            <div>
              <label className="block text-sm font-medium mb-1">Results limit</label>
              <div className="flex gap-2">
                {resultLimitOptions.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLimit(l)}
                    className={`px-3 py-1.5 rounded text-sm border ${
                      limit === l ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Result detail</label>
              <div className="flex gap-2">
                {(["minimal", "snippets", "full"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setResultMode(m)}
                    className={`px-3 py-1.5 rounded text-sm border capitalize ${
                      resultMode === m ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t">
        <Button type="submit" disabled={!canSubmit} size="lg" className="gap-2">
          <Search className="w-4 h-4" />
          Find similar patterns
        </Button>
        {!canSubmit && <p className="text-sm text-muted-foreground mt-2">Select a product type to continue.</p>}
      </div>
    </form>
  );
}

export interface TaxonomyOption {
  id: string;
  label: string;
  description?: string;
}

export const productTypes: TaxonomyOption[] = [
  { id: "case-management", label: "Case management", description: "Track, manage and resolve cases across workflows" },
  { id: "forms-applications", label: "Forms and applications", description: "Collect structured data through multi-step forms" },
  { id: "booking-appointments", label: "Booking and appointments", description: "Schedule, manage and track appointments" },
  { id: "payments-billing", label: "Payments and billing", description: "Process payments, fees, and financial transactions" },
  { id: "identity-access", label: "Identity and access", description: "Verify identity and manage user access" },
  { id: "notifications-messaging", label: "Notifications and messaging", description: "Send alerts, emails, SMS and notifications" },
  { id: "document-records", label: "Document and records workflow", description: "Manage document lifecycles and record keeping" },
  { id: "grants-funding", label: "Grants and funding", description: "Application, assessment and distribution of grants" },
  { id: "licensing-permits", label: "Licensing and permits", description: "Issue, renew and manage licences and permits" },
  { id: "complaints-contact", label: "Complaints and contact handling", description: "Handle enquiries, complaints and correspondence" },
  { id: "internal-ops", label: "Internal operations tool", description: "Staff-facing tools for internal processes" },
  { id: "crm-support", label: "CRM / service support platform", description: "Customer relationship and service desk tools" },
  { id: "data-survey", label: "Data collection / survey service", description: "Gather and analyse structured survey data" },
  { id: "eligibility-rules", label: "Eligibility and rules engine", description: "Determine entitlements and apply business rules" },
  { id: "other", label: "Other", description: "Describe your own product type" },
];

export const userGroups: TaxonomyOption[] = [
  { id: "citizens", label: "Citizens" },
  { id: "businesses", label: "Businesses" },
  { id: "internal-staff", label: "Internal staff" },
  { id: "case-workers", label: "Case workers" },
  { id: "contact-centre", label: "Contact centre teams" },
  { id: "inspectors", label: "Inspectors / compliance teams" },
  { id: "healthcare", label: "Healthcare staff" },
  { id: "local-authority", label: "Local authority teams" },
  { id: "education", label: "Education sector staff" },
  { id: "mixed", label: "Mixed users" },
];

export const capabilities: TaxonomyOption[] = [
  { id: "auth", label: "Authentication and sign-in" },
  { id: "multi-step-forms", label: "Multi-step forms" },
  { id: "document-upload", label: "Document upload" },
  { id: "case-tracking", label: "Case tracking" },
  { id: "search-filtering", label: "Search and filtering" },
  { id: "dashboards", label: "Dashboards" },
  { id: "reporting", label: "Reporting" },
  { id: "notifications", label: "Notifications" },
  { id: "email-sms", label: "Email / SMS integration" },
  { id: "payments", label: "Payments" },
  { id: "booking-calendar", label: "Booking calendar" },
  { id: "approvals", label: "Approvals workflow" },
  { id: "business-rules", label: "Business rules / eligibility logic" },
  { id: "legacy-integration", label: "Integration with legacy systems" },
  { id: "api-integration", label: "API integration" },
  { id: "accessibility", label: "Accessibility support" },
  { id: "audit-trail", label: "Audit trail" },
  { id: "role-permissions", label: "Role-based permissions" },
  { id: "data-export", label: "Data export" },
  { id: "content-management", label: "Content management" },
  { id: "task-management", label: "Task management" },
  { id: "service-analytics", label: "Service analytics" },
];

export const painPoints: TaxonomyOption[] = [
  { id: "fragmented-cases", label: "Fragmented case handling" },
  { id: "duplicate-processing", label: "Duplicate manual processing" },
  { id: "poor-ux", label: "Poor user journey" },
  { id: "legacy-complexity", label: "Legacy integration complexity" },
  { id: "inconsistent-data", label: "Inconsistent data capture" },
  { id: "slow-approvals", label: "Slow approvals" },
  { id: "high-contact", label: "High contact volumes" },
  { id: "inaccessible-forms", label: "Inaccessible forms" },
  { id: "identity-friction", label: "Identity verification friction" },
  { id: "poor-visibility", label: "Poor cross-team visibility" },
  { id: "no-auditability", label: "No auditability" },
  { id: "weak-reporting", label: "Weak reporting" },
  { id: "complex-rules", label: "Complex rules or eligibility" },
  { id: "document-heavy", label: "Document-heavy workflows" },
  { id: "channel-shift", label: "Channel shift from phone/email to digital" },
];

export const domainHints: TaxonomyOption[] = [
  { id: "health", label: "Health" },
  { id: "tax", label: "Tax" },
  { id: "transport", label: "Transport" },
  { id: "justice", label: "Justice" },
  { id: "local-gov", label: "Local government" },
  { id: "education", label: "Education" },
  { id: "housing", label: "Housing" },
  { id: "planning", label: "Planning" },
  { id: "environment", label: "Environment" },
  { id: "social-care", label: "Social care" },
  { id: "immigration", label: "Immigration / borders" },
  { id: "business-reg", label: "Business regulation" },
  { id: "shared-services", label: "Central government shared services" },
];

export const resultLimitOptions = [5, 10, 20] as const;
export type ResultLimit = (typeof resultLimitOptions)[number];

export const resultModeOptions = ["minimal", "snippets", "full"] as const;
export type ResultMode = (typeof resultModeOptions)[number];

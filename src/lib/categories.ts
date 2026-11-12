import type { IconName } from "@/components/Icon";

export const CATEGORIES: { icon: IconName; title: string; examples: string[] }[] = [
  {
    icon: "leads",
    title: "Lead generation, qualification & follow-ups",
    examples: ["Capture enquiries from every channel", "Qualify against your criteria", "Follow up on the schedule you agree"],
  },
  {
    icon: "support",
    title: "Customer enquiries & routine support",
    examples: ["Answer recurring questions from approved answers", "Status and order updates", "Hand complaints to a person"],
  },
  {
    icon: "data",
    title: "Data entry & CRM management",
    examples: ["Keep records current without retyping", "Sync details between tools", "Clean and de-duplicate entries"],
  },
  {
    icon: "calendar",
    title: "Administrative work & scheduling",
    examples: ["Book, confirm and reschedule", "Reminders and recurring admin", "Prepare routine paperwork"],
  },
  {
    icon: "document",
    title: "Document processing",
    examples: ["Read invoices, forms and PDFs", "Check for missing details", "File and enter the results"],
  },
  {
    icon: "coordinate",
    title: "Internal communication & task coordination",
    examples: ["Route requests to the right person", "Chase hand-offs between teams", "Keep everyone on the same status"],
  },
  {
    icon: "report",
    title: "Reporting, monitoring & recurring operations",
    examples: ["Daily and weekly reports, assembled", "Watch for things that need attention", "Run the same operation every cycle"],
  },
  {
    icon: "industry",
    title: "Industry-specific repetitive workflows",
    examples: ["The routine that’s specific to your trade", "Designed around how you already operate", "Scoped with you, not from a template"],
  },
];

export const SETTING_DEFAULTS = {
  siteTagline: "Learning protein folding pathways",
  heroTitle: "From sequence to dynamic folding pathways",
  heroSubtitle:
    "PathFold is a generative AI framework that learns and predicts how proteins fold and misfold over time, directly from their amino acid sequence.",
  announcement: "",
  contactEmail: "m.rahman@iss.uni-saarland.de",
  contactName: "Dr.-Ing. Maxx Richard Rahman",
  contactRole: "Project Leader",
  contactInstitution: "Saarland University",
  contactAddress: "Campus A5 4, 66123 Saarbrücken, Germany",
  githubUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  blueskyUrl: "",
  fundingText:
    "PathFold is funded by the German Federal Ministry of Research, Technology and Space (BMFTR) under the “Zukunft eHealth” funding guideline.",
  footerNote: "UdS · DFKI · DZNE",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type Settings = Record<SettingKey, string>;

export const SETTING_FIELDS: Array<{ key: SettingKey; label: string; type: "text" | "textarea" | "url" | "email"; help?: string }> = [
  { key: "siteTagline", label: "Site tagline", type: "text" },
  { key: "heroTitle", label: "Hero title", type: "text" },
  { key: "heroSubtitle", label: "Hero subtitle", type: "textarea" },
  { key: "announcement", label: "Announcement banner", type: "text", help: "Shown at the top of every page when not empty." },
  { key: "contactName", label: "Contact name", type: "text" },
  { key: "contactRole", label: "Contact role", type: "text" },
  { key: "contactEmail", label: "Contact e-mail", type: "email" },
  { key: "contactInstitution", label: "Institution", type: "text" },
  { key: "contactAddress", label: "Postal address", type: "textarea" },
  { key: "githubUrl", label: "GitHub URL", type: "url" },
  { key: "linkedinUrl", label: "LinkedIn URL", type: "url" },
  { key: "twitterUrl", label: "X / Twitter URL", type: "url" },
  { key: "blueskyUrl", label: "Bluesky URL", type: "url" },
  { key: "fundingText", label: "Funding statement", type: "textarea" },
  { key: "footerNote", label: "Footer note", type: "text" },
];

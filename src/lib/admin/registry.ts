/**
 * Declarative description of every content type that can be managed in /admin.
 * The admin list and form pages are generated from these definitions.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "date"
  | "checkbox"
  | "select"
  | "image"
  | "url"
  | "email";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  help?: string;
  placeholder?: string;
  width?: "full" | "half" | "third";
  rows?: number;
}

export interface ModelDef {
  /** URL segment and Prisma delegate name (camelCase) */
  key: string;
  label: string;
  singular: string;
  description: string;
  icon: string; // lucide icon name, resolved in the UI
  fields: FieldDef[];
  /** columns shown in the list view */
  listColumns: Array<{ name: string; label: string; type?: "date" | "boolean" | "text" }>;
  orderBy: Array<Record<string, "asc" | "desc">>;
  /** fields searched by the list filter */
  searchFields: string[];
  /** public route to show a "view on site" link */
  publicPath?: string;
  /** when true, the model is read-only (no create form) */
  readOnly?: boolean;
}

export const NEWS_CATEGORIES = ["News", "Event", "Press", "Talk", "Release"];
export const PUBLICATION_TYPES = ["Journal", "Conference", "Workshop", "Preprint", "Dataset", "Software", "Thesis", "Book chapter"];
export const PUBLICATION_CATEGORIES = ["PathFold", "Related work"];
export const TEAM_GROUPS = ["Core team", "Associated partners", "Advisors", "Alumni", "Open positions"];
export const PARTNER_TYPES = ["Coordinator", "Associated partner", "Infrastructure", "Funding"];
export const MEDIA_TYPES = ["Image", "Video", "Press", "Talk", "Poster", "Document"];
export const RESOURCE_KINDS = ["Software", "Benchmark", "Dataset", "Model", "Documentation"];
export const RESOURCE_STATUS = ["Planned", "In development", "Released"];
export const MILESTONE_STATUS = ["Planned", "In progress", "Achieved"];

export const MODELS: ModelDef[] = [
  {
    key: "newsPost",
    label: "News",
    singular: "News post",
    description: "Announcements, events, press and talks shown on the News page.",
    icon: "Newspaper",
    publicPath: "/news",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", help: "URL segment. Leave empty to generate from the title.", width: "half" },
      { name: "category", label: "Category", type: "select", options: NEWS_CATEGORIES, required: true, width: "half" },
      { name: "publishedAt", label: "Date", type: "date", required: true, width: "half" },
      { name: "coverImage", label: "Cover image", type: "image", width: "half" },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true, rows: 3, help: "Short summary shown in lists." },
      { name: "content", label: "Content (Markdown)", type: "markdown", rows: 14 },
      { name: "externalUrl", label: "External link", type: "url", help: "Optional link to a press article or external page.", width: "half" },
      { name: "published", label: "Published", type: "checkbox", width: "third" },
      { name: "featured", label: "Featured on home page", type: "checkbox", width: "third" },
    ],
    listColumns: [
      { name: "title", label: "Title" },
      { name: "category", label: "Category" },
      { name: "publishedAt", label: "Date", type: "date" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    orderBy: [{ publishedAt: "desc" }],
    searchFields: ["title", "excerpt"],
  },
  {
    key: "publication",
    label: "Publications",
    singular: "Publication",
    description: "Papers, preprints, datasets and software releases.",
    icon: "BookOpen",
    publicPath: "/publications",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "authors", label: "Authors", type: "text", required: true, help: "e.g. Rahman, M. R., Hammouda, M., & Maass, W." },
      { name: "venue", label: "Venue", type: "text", required: true, width: "half" },
      { name: "year", label: "Year", type: "number", required: true, width: "half" },
      { name: "type", label: "Type", type: "select", options: PUBLICATION_TYPES, required: true, width: "half" },
      { name: "category", label: "Category", type: "select", options: PUBLICATION_CATEGORIES, required: true, width: "half" },
      { name: "doi", label: "DOI", type: "text", placeholder: "10.1000/xyz123", width: "half" },
      { name: "url", label: "Link", type: "url", width: "half" },
      { name: "pdfUrl", label: "PDF link", type: "url", width: "half" },
      { name: "codeUrl", label: "Code link", type: "url", width: "half" },
      { name: "abstract", label: "Abstract", type: "textarea", rows: 6 },
      { name: "bibtex", label: "BibTeX", type: "textarea", rows: 6 },
      { name: "featured", label: "Featured on home page", type: "checkbox", width: "half" },
      { name: "order", label: "Sort order", type: "number", width: "half", help: "Lower numbers appear first within a year." },
    ],
    listColumns: [
      { name: "title", label: "Title" },
      { name: "venue", label: "Venue" },
      { name: "year", label: "Year" },
      { name: "category", label: "Category" },
    ],
    orderBy: [{ year: "desc" }, { order: "asc" }],
    searchFields: ["title", "authors", "venue"],
  },
  {
    key: "teamMember",
    label: "Team",
    singular: "Team member",
    description: "People and partner contacts shown on the Team page.",
    icon: "Users",
    publicPath: "/team",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, width: "half" },
      { name: "role", label: "Role", type: "text", required: true, width: "half" },
      { name: "affiliation", label: "Affiliation", type: "text", required: true, width: "half" },
      { name: "group", label: "Group", type: "select", options: TEAM_GROUPS, required: true, width: "half" },
      { name: "photo", label: "Photo", type: "image", width: "half" },
      { name: "email", label: "E-mail", type: "email", width: "half" },
      { name: "bio", label: "Biography", type: "textarea", rows: 6 },
      { name: "website", label: "Website", type: "url", width: "half" },
      { name: "orcid", label: "ORCID", type: "url", width: "half" },
      { name: "scholar", label: "Google Scholar", type: "url", width: "half" },
      { name: "linkedin", label: "LinkedIn", type: "url", width: "half" },
      { name: "order", label: "Sort order", type: "number", width: "half" },
    ],
    listColumns: [
      { name: "name", label: "Name" },
      { name: "role", label: "Role" },
      { name: "group", label: "Group" },
    ],
    orderBy: [{ order: "asc" }],
    searchFields: ["name", "role", "affiliation"],
  },
  {
    key: "partner",
    label: "Partners",
    singular: "Partner",
    description: "Coordinator, associated partners, infrastructure and funding bodies.",
    icon: "Building2",
    publicPath: "/about#partners",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "shortName", label: "Short name", type: "text", width: "half" },
      { name: "type", label: "Type", type: "select", options: PARTNER_TYPES, required: true, width: "half" },
      { name: "logo", label: "Logo", type: "image", width: "half" },
      { name: "website", label: "Website", type: "url", width: "half" },
      { name: "description", label: "Description / role in the project", type: "textarea", rows: 4 },
      { name: "order", label: "Sort order", type: "number", width: "half" },
    ],
    listColumns: [
      { name: "name", label: "Name" },
      { name: "type", label: "Type" },
    ],
    orderBy: [{ order: "asc" }],
    searchFields: ["name", "shortName"],
  },
  {
    key: "mediaItem",
    label: "Media",
    singular: "Media item",
    description: "Images, videos, posters, talks and press coverage for the Media page.",
    icon: "Image",
    publicPath: "/media",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: MEDIA_TYPES, required: true, width: "half" },
      { name: "date", label: "Date", type: "date", width: "half" },
      { name: "url", label: "File / link", type: "image", required: true, help: "Upload an image or paste a link (YouTube, article, PDF…)." },
      { name: "thumbnail", label: "Thumbnail", type: "image", help: "Optional preview image for videos, articles and documents." },
      { name: "source", label: "Source / outlet", type: "text", width: "half" },
      { name: "order", label: "Sort order", type: "number", width: "half" },
      { name: "description", label: "Caption", type: "textarea", rows: 3 },
    ],
    listColumns: [
      { name: "title", label: "Title" },
      { name: "type", label: "Type" },
      { name: "date", label: "Date", type: "date" },
    ],
    orderBy: [{ order: "asc" }, { date: "desc" }],
    searchFields: ["title", "source"],
  },
  {
    key: "resource",
    label: "Resources",
    singular: "Resource",
    description: "Software, benchmarks, datasets and documentation released by the project.",
    icon: "Package",
    publicPath: "/resources",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "kind", label: "Kind", type: "select", options: RESOURCE_KINDS, required: true, width: "half" },
      { name: "status", label: "Status", type: "select", options: RESOURCE_STATUS, required: true, width: "half" },
      { name: "description", label: "Description", type: "textarea", required: true, rows: 4 },
      { name: "url", label: "Website / landing page", type: "url", width: "third" },
      { name: "repoUrl", label: "Repository", type: "url", width: "third" },
      { name: "docsUrl", label: "Documentation", type: "url", width: "third" },
      { name: "order", label: "Sort order", type: "number", width: "half" },
    ],
    listColumns: [
      { name: "name", label: "Name" },
      { name: "kind", label: "Kind" },
      { name: "status", label: "Status" },
    ],
    orderBy: [{ order: "asc" }],
    searchFields: ["name", "description"],
  },
  {
    key: "workPackage",
    label: "Work packages",
    singular: "Work package",
    description: "The work packages of the project plan shown on the About page.",
    icon: "Layers",
    publicPath: "/about#workplan",
    fields: [
      { name: "number", label: "Number", type: "number", required: true, width: "third" },
      { name: "period", label: "Period", type: "text", required: true, width: "third", placeholder: "M01–M12" },
      { name: "lead", label: "Lead", type: "text", width: "third" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true, rows: 3 },
      { name: "objectives", label: "Objectives & tasks (Markdown)", type: "markdown", rows: 10 },
      { name: "deliverables", label: "Deliverables", type: "textarea", rows: 3 },
      { name: "order", label: "Sort order", type: "number", width: "half" },
    ],
    listColumns: [
      { name: "number", label: "No." },
      { name: "title", label: "Title" },
      { name: "period", label: "Period" },
    ],
    orderBy: [{ order: "asc" }, { number: "asc" }],
    searchFields: ["title", "summary"],
  },
  {
    key: "milestone",
    label: "Milestones",
    singular: "Milestone",
    description: "Project milestones and their status.",
    icon: "Flag",
    publicPath: "/about#milestones",
    fields: [
      { name: "code", label: "Code", type: "text", required: true, width: "third", placeholder: "M1" },
      { name: "due", label: "Due", type: "text", required: true, width: "third", placeholder: "Sep 2027" },
      { name: "workPackage", label: "Work package", type: "text", width: "third", placeholder: "WP1" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true, rows: 4 },
      { name: "status", label: "Status", type: "select", options: MILESTONE_STATUS, required: true, width: "half" },
      { name: "order", label: "Sort order", type: "number", width: "half" },
    ],
    listColumns: [
      { name: "code", label: "Code" },
      { name: "title", label: "Title" },
      { name: "due", label: "Due" },
      { name: "status", label: "Status" },
    ],
    orderBy: [{ order: "asc" }, { code: "asc" }],
    searchFields: ["title", "code"],
  },
  {
    key: "contactMessage",
    label: "Messages",
    singular: "Message",
    description: "Messages submitted through the contact form.",
    icon: "Mail",
    readOnly: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true, width: "half" },
      { name: "email", label: "E-mail", type: "email", required: true, width: "half" },
      { name: "subject", label: "Subject", type: "text", required: true },
      { name: "message", label: "Message", type: "textarea", required: true, rows: 8 },
      { name: "read", label: "Marked as read", type: "checkbox" },
    ],
    listColumns: [
      { name: "subject", label: "Subject" },
      { name: "name", label: "From" },
      { name: "createdAt", label: "Received", type: "date" },
      { name: "read", label: "Read", type: "boolean" },
    ],
    orderBy: [{ createdAt: "desc" }],
    searchFields: ["name", "email", "subject", "message"],
  },
];

export function getModel(key: string): ModelDef | undefined {
  return MODELS.find((m) => m.key === key);
}

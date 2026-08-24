export const SECTIONS = {
	articles: { title: 'Articles', order: 1 },
	projects: { title: 'Projects', order: 2 },
	notes: { title: 'Notes', order: 3 },
} as const;

export type SectionKey = keyof typeof SECTIONS;

export const SECTION_KEYS = ['articles', 'projects', 'notes'] as const satisfies readonly SectionKey[];

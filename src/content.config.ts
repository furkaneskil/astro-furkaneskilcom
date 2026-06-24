import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { SECTION_KEYS } from './config/sections';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		section: z.enum(SECTION_KEYS),
		draft: z.boolean().default(false),
		series: z.string().optional(),
		seriesOrder: z.number().optional(),
		linkStyle: z.enum(['normal', 'small']).default('normal'),
		memorial: z.string().optional(),
	}),
});

export const collections = { blog };

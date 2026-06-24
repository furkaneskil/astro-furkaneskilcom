import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { SECTION_KEYS, type SectionKey } from '../config/sections';

/** Strip trailing `/index` from glob loader ids like `my-post/index`. */
export function normalizeSlug(id: string): string {
	return id.replace(/\/index$/, '');
}

export function formatHomeDate(date: Date): string {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

export function formatArticleDate(date: Date): string {
	return date.toLocaleDateString('en-us', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export type PostsBySection = Record<SectionKey, CollectionEntry<'blog'>[]>;

export async function getPostsBySection(): Promise<PostsBySection> {
	const posts = await getPublishedPosts();
	const grouped = Object.fromEntries(
		SECTION_KEYS.map((key) => [key, [] as CollectionEntry<'blog'>[]]),
	) as PostsBySection;

	for (const post of posts) {
		grouped[post.data.section].push(post);
	}

	return grouped;
}

/** Insert blank lines between posts in different series groups. */
export function groupPostsForDisplay(posts: CollectionEntry<'blog'>[]) {
	const rows: { post: CollectionEntry<'blog'>; spacerBefore: boolean }[] = [];

	for (let i = 0; i < posts.length; i++) {
		const post = posts[i];
		const prev = posts[i - 1];
		const spacerBefore =
			i > 0 &&
			!!post.data.series &&
			!!prev?.data.series &&
			post.data.series !== prev.data.series;

		rows.push({ post, spacerBefore });
	}

	return rows;
}

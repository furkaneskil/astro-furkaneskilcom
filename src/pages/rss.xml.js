import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { normalizeSlug } from '../utils/blog';

export async function GET(context) {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
	const feedUrl = new URL('rss.xml', context.site).href;

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		stylesheet: '/pretty-feed-v3.xsl',
		xmlns: {
			atom: 'http://www.w3.org/2005/Atom',
		},
		items: sorted.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${normalizeSlug(post.id)}/`,
		})),
		customData: `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
	});
}

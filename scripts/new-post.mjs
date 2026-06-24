#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const slug = process.argv[2];
const section = process.argv.includes('--section')
	? process.argv[process.argv.indexOf('--section') + 1]
	: 'articles';

if (!slug) {
	console.error('Usage: npm run new:post <slug> [--section articles|projects|notes]');
	process.exit(1);
}

const targetDir = join(root, 'src/content/blog', slug);
const templatePath = join(root, 'scripts/content-template/index.md');
const targetPath = join(targetDir, 'index.md');

if (existsSync(targetDir)) {
	console.error(`Already exists: ${targetDir}`);
	process.exit(1);
}

mkdirSync(targetDir, { recursive: true });
cpSync(templatePath, targetPath);

const content = readFileSync(targetPath, 'utf8').replace(
	/^section: articles$/m,
	`section: ${section}`,
);
writeFileSync(targetPath, content);

console.log(`Created: src/content/blog/${slug}/index.md`);
console.log(`Section: ${section}`);
console.log('Set draft: false when ready to publish.');

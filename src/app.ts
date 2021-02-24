import { scrapChapter } from './lib.js';

const url = 'https://magi-manga.net/comic/magi-manga-chapter-';

await scrapChapter(url, '1');
await scrapChapter(url, '2');


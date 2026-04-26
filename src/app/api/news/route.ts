import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; RSSReader/1.0)',
  },
});

const FEEDS = [
  { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex', category: 'מניות' },
  { name: 'Reuters Business', url: 'https://feeds.reuters.com/reuters/businessNews', category: 'עסקים' },
  { name: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', category: 'כלכלה' },
  { name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories/', category: 'מניות' },
  { name: 'Investing.com', url: 'https://www.investing.com/rss/news.rss', category: 'כלכלה' },
  { name: 'Seeking Alpha', url: 'https://seekingalpha.com/feed.xml', category: 'מניות' },
  { name: 'Globes', url: 'https://www.globes.co.il/rss/rss_top.aspx', category: 'ישראל' },
  { name: 'Ynet כלכלה', url: 'https://www.ynet.co.il/Integration/StoryRss3590.xml', category: 'ישראל' },
];

export async function GET() {
  try {
    const allItems: object[] = [];

    for (const feed of FEEDS) {
      try {
        const parsed = await parser.parseURL(feed.url);
        const items = parsed.items.slice(0, 8).map(item => ({
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          source: feed.name,
          category: feed.category,
          content: item.contentSnippet || item.content || '',
        }));
        allItems.push(...items);
      } catch (e) {
        console.error(`Failed to fetch ${feed.name}:`, e);
      }
    }

    allItems.sort((a: any, b: any) =>
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    return NextResponse.json({ items: allItems });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
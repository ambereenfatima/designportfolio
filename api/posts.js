import { richTextToHtml } from './_richtext.js';

export default async function handler(req, res) {
    const dbRes = await fetch(
        `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sorts: [{ property: 'date', direction: 'descending' }],
            }),
        }
    );
    const dbData = await dbRes.json();

    const posts = dbData.results.map(page => ({
        title: richTextToHtml(page.properties.title.title) || 'untitled',
        date: page.properties.date.date?.start || '',
        slug: page.properties.slug.rich_text[0]?.plain_text || '',
        description: richTextToHtml(page.properties.description?.rich_text),
        cover: page.properties.cover?.files?.[0]?.file?.url ?? null,
    }));

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(posts);
}
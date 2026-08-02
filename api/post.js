import { richTextToHtml } from './_richtext.js';

export default async function handler(req, res) {
    const { slug } = req.query;

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
                filter: { property: 'slug', rich_text: { equals: slug } },
            }),
        }
    );
    const dbData = await dbRes.json();
    const page = dbData.results[0];

    if (!page) {
        res.status(404).json({ error: 'not found' });
        return;
    }

    const blocksRes = await fetch(
        `https://api.notion.com/v1/blocks/${page.id}/children`,
        {
            headers: {
                Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
            },
        }
    );
    const blocksData = await blocksRes.json();

    const html = blocksData.results.map(block => {
        if (block.type === 'paragraph') {
            return `<p>${richTextToHtml(block.paragraph.rich_text)}</p>`;
        }
        if (block.type === 'heading_2') {
            return `<h2>${richTextToHtml(block.heading_2.rich_text)}</h2>`;
        }
        if (block.type === 'image') {
            const url = block.image.file?.url || block.image.external?.url;
            return `<img class="post-image" src="${url}">`;
        }
        return '';
    }).join('');

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
        title: richTextToHtml(page.properties.title.title),
        date: page.properties.date.date?.start,
        description: richTextToHtml(page.properties.description?.rich_text),
        banner: page.cover?.file?.url || page.cover?.external?.url || '',
        content: html,
    });
}


export function richTextToHtml(richText = []) {
    return richText.map(t => {
        let text = t.plain_text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        const a = t.annotations || {};
        if (a.code) text = `<code>${text}</code>`;
        if (a.bold) text = `<strong>${text}</strong>`;
        if (a.italic) text = `<em>${text}</em>`;
        if (a.strikethrough) text = `<s>${text}</s>`;
        if (a.underline) text = `<u>${text}</u>`;

        if (t.href) text = `<a href="${t.href}" target="_blank" rel="noopener">${text}</a>`;

        return text;
    }).join('');
}
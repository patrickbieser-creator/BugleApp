import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
td.use(gfm);

export function useExport() {
  const exportArticle = (article) => {
    const slug = article.title
      ? article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : article.id;
    const md = `# ${article.title}\n\n${td.turndown(article.body_html || '')}`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { exportArticle };
}

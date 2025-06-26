import getFlexiblePage from './getFlexiblePage';
import getPageLinks from './getPageLinks';

const PAGE_IDS = {
  Why: '226',
  What: '26',
  How: '241',
  Who: '243',
};

export default async function getMeganavData() {
  const entries = await Promise.all(
    Object.entries(PAGE_IDS).map(async ([key, id]) => {
      const [content, pageLinks] = await Promise.all([
        getFlexiblePage(id),
        getPageLinks(id)
      ]);
      const links = Array.isArray(content)
        ? content.filter(block => block && block.id).map(block => ({ ...block, sectionLabel: block.sectionLabel || block.title || block.heading || block.id }))
        : [];
      return [key, { links, pageLinks }];
    })
  );
  return Object.fromEntries(entries);
} 
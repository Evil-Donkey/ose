import getFlexiblePage from './getFlexiblePage';

const PAGE_IDS = {
  Why: '226',
  What: '26',
  How: '241',
  Who: '243',
};

export default async function getMeganavLinks() {
  const entries = await Promise.all(
    Object.entries(PAGE_IDS).map(async ([key, sectionLabel]) => {
      const content = await getFlexiblePage(sectionLabel);
      const links = Array.isArray(content)
        ? content.filter(block => block && block.sectionLabel).map(block => ({ sectionLabel: block.sectionLabel }))
        : [];
      return [key, links];
    })
  );
  return Object.fromEntries(entries);
} 
// Helper to format section labels for anchor links
export default function formatSectionLabel(sectionLabel) {
  if (!sectionLabel) return '';
  return sectionLabel
    .replace(/\./g, '')
    .replace(/[’"']/g, '')
    .replace(/\s/g, '-')
    .toLowerCase();
} 
import getThemeSettings from './getThemeSettings';

const EMPTY_FOOTER_DATA = {
  copyright: null,
  address: null,
  oxfordAcademicsEmail: null,
  investorsEmail: null,
  mediaEmail: null,
  telephone: null,
  ctaTitle: null,
  ctaCopy: null,
  cta: null,
};

function isFooterSettingsEmpty(settings) {
  if (!settings) return true;
  const hasContact =
    settings.telephone ||
    settings.oxfordAcademicsEmail ||
    settings.investorsEmail ||
    settings.mediaEmail ||
    settings.address;
  const hasCta =
    settings.ctaTitle ||
    settings.ctaCopy ||
    (Array.isArray(settings.cta) && settings.cta.length > 0);
  return !hasContact && !hasCta;
}

export default async function getFooterData() {
  const settings = await getThemeSettings();

  if (isFooterSettingsEmpty(settings)) {
    console.error(
      '[getFooterData] global theme settings missing or empty after fetch — ' +
        'footer contact info and page CTA blocks will be blank for this render.'
    );
    return EMPTY_FOOTER_DATA;
  }

  return {
    copyright: settings.copyright,
    address: settings.address,
    oxfordAcademicsEmail: settings.oxfordAcademicsEmail,
    investorsEmail: settings.investorsEmail,
    mediaEmail: settings.mediaEmail,
    telephone: settings.telephone,
    ctaTitle: settings.ctaTitle,
    ctaCopy: settings.ctaCopy,
    cta: settings.cta,
  };
}

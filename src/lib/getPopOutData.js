import getThemeSettings from './getThemeSettings';
import { proxyCmsHtmlImages } from './proxyImage';

const EMPTY_POPOUT_DATA = {
  popoutLabel: null,
  popoutContent: null,
};

export default async function getPopOutData() {
  const settings = await getThemeSettings();

  // The popout is decorative — a transient CMS failure must not 500 the whole
  // page. getThemeSettings keeps a last-known-good copy in memory, so a null
  // here means a cold instance during a CMS blip; render without the popout.
  if (!settings) {
    console.error(
      '[getPopOutData] theme settings unavailable — rendering without popout for this request.'
    );
    return EMPTY_POPOUT_DATA;
  }

  return {
    popoutLabel: settings.popoutLabel,
    popoutContent: Array.isArray(settings.popoutContent)
      ? settings.popoutContent.map((item) => ({
          ...item,
          copy: proxyCmsHtmlImages(item.copy),
        }))
      : settings.popoutContent,
  };
}

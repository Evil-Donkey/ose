import getThemeSettings from './getThemeSettings';

const EMPTY_POPOUT_DATA = {
  popoutLabel: null,
  popoutContent: null,
};

export default async function getPopOutData() {
  const settings = await getThemeSettings();

  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (!isBuildPhase && settings === null) {
    throw new Error('CMS_FETCH_FAILED: popout data');
  }

  if (!settings) {
    return EMPTY_POPOUT_DATA;
  }

  return {
    popoutLabel: settings.popoutLabel,
    popoutContent: settings.popoutContent,
  };
}

import getMeganavBundle from './getMeganavBundle';

export default async function getMeganavLinksLite() {
  const bundle = await getMeganavBundle();
  return Object.fromEntries(
    Object.entries(bundle).map(([key, value]) => [key, value.links])
  );
}

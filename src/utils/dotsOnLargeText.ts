export default function dotsOnLargeText(text: string, limit: number) {
  if (typeof text !== 'string') {
    throw new Error(
      'Error: dotsOnLargeText(string) expects a string argument.'
    );
  }

  const LIMIT = limit;
  const aboveLimit = text.length > LIMIT;
  const dotsOrEmpty = aboveLimit ? '...' : '';

  return text.substring(0, LIMIT) + dotsOrEmpty;
}

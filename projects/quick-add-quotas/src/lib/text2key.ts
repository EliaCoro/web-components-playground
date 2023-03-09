export const text2key: (text: string | undefined) => string = (text: string | undefined) => {
  if (!(text && typeof text == 'string' && text.length > 0)) return '';

  const key = text
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/ /g, '_')
    .toLowerCase();
  return key;
}
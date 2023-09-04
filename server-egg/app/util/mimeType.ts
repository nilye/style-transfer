import { isString } from 'lodash';

export function mimeTypeToFileExt(mimeType: string) {
  if (!mimeType || !isString(mimeType)) return '';

  const fileType = mimeType.split('/')[1];
  if (!fileType) return '';

  return ({
    jpeg: '.jpg',
    png: '.png',
    gif: '.gif',
    webp: '.webp',
    svg: '.svg',
  })[fileType];
}

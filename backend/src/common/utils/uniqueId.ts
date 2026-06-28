import { v4 as uuidv4 } from 'uuid';

export function generateUniqueId(prefix: string): string {
  const shortId = uuidv4().split('-')[0].toUpperCase();

  return `${prefix}-${shortId}`;
}
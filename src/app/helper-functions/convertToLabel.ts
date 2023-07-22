export function convertToLabel(a: string): string {
    return a
      .replace(/([A-Z][a-z]+)/g, ' $1')
      .replace(/([\dA-Z]+)/g, ' $1')
      .replace(/\s\s/g, ' ')
      .replace(/^./, (match) => match.toUpperCase())
      .trim();
  }
/**
 * Converts URLs in text to clickable links
 * @param text - The text containing potential URLs
 * @returns JSX with clickable links
 */
export function linkify(text: string): (string | JSX.Element)[] {
  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = urlPattern.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add the URL as a clickable link
    const url = match[0];
    parts.push(
      <a
        key={ match.index }
        href = { url }
        target = "_blank"
        rel = "noopener noreferrer"
        className = "text-blue-500 hover:text-blue-600 underline"
      >
      { url }
      </a>
    );

    lastIndex = match.index + url.length;
  }

  // Add remaining text after the last URL
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

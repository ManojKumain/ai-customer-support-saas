export function generateTitleFromText(text) {
  if (!text) return "New Chat";

  // Remove special characters but keep letters, numbers and spaces
  const cleanText = text.replace(/[^\w\s]/gi, "");

  const words = cleanText.trim().split(/\s+/);

  // Take first 6 words
  const title = words.slice(0, 6).join(" ");

  return title || "New Chat";
}
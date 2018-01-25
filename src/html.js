export function escapeHTML(html) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export const escapeAttributeValue = v => v // TODO
export const validateSymbol = s => s // TODO
export const attributeName = name => validateSymbol(name)

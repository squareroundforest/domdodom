export const escapeHTML = s => s
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

export const escapeAttribute = s => s // TODO
export const validateSymbol = s => s // TODO
export const attributeName = name => name === 'className' ? 'class' : validateSymbol(name)

// Prefix a rendered page with a doctype so browsers use standards mode.
export const doc = (html) => '<!DOCTYPE html>' + html;
// Escape a value for safe interpolation into HTML text or a double-quoted
// attribute. Use it for anything dynamic (user input, DB values); static markup
// is written literally.
export const esc = (v) => String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

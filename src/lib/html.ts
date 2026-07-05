// Prefix rendered JSX with a doctype so browsers use standards mode.
export const doc = (node: unknown) => '<!DOCTYPE html>' + String(node)

export const lowerCaseSlugOrId = (value, type) => (type === 'slug' && typeof value === 'string' ? value.toLowerCase() : value);

// Reference: https://dexie.org/docs/API-Reference#quick-reference
import Dexie from 'dexie';

const database = new Dexie('Articles');

database.version(1).stores({
  articles: `
    &slug,
    id,
    created_at,
    is_deleted,
    title,
    type,
    cache_mode,
    version,
    updated_at,
    author_first,
    author_last,
    author_email,
    content,
    *tags
  `,
});

export const dbArticles = database;


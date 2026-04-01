import { sanitizeProperties } from 'lib/utils/validations';
import { dbArticles } from './initiateDatabase';


export const saveArticle = async (payload) => {
  const cleanedPayload = cleanPayload(payload);

  const sanitizedPayload = sanitizeProperties(cleanedPayload, {
    requiredKeys: [ 'id', 'created_at', 'title', 'type', 'cache_mode', 'slug', 'version', 'content' ],
    optionalKeys: [ 'author_first', 'author_last', 'author_email', 'tags', 'is_deleted', 'updated_at' ],
    shouldThrow: false,
  });
  if (!sanitizedPayload?.valid) { return false; }

  return await dbArticles.articles.put(cleanedPayload)
    .then(() => {
      return dbArticles.articles.where('id').equals(cleanedPayload.id).first();
    });
};


const simplifyTagArray = tagArray => tagArray.map(tagObject => tagObject.tag);


function cleanPayload(article) {
  const { author, is_deleted, ...remainingProps } = article;

  let authorObject = {};
  if (author) {
    authorObject = {
      author_first: author.first_name,
      author_last: author.last_name,
      author_email: author.email,
    };
  }

  const cleanedArticle = {
    ...authorObject,
    ...remainingProps,
  };

  if (cleanedArticle.tags) {
    cleanedArticle.tags = simplifyTagArray(cleanedArticle.tags);
  }

  return cleanedArticle;
}

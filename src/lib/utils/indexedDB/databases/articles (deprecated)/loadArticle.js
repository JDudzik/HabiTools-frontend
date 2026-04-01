// Reference: https://dexie.org/docs/API-Reference#quick-reference
import { lowerCaseSlugOrId } from '../../helpers';
import { dbArticles } from './initiateDatabase';


export const loadArticle = async (value, type = 'slug') => {
  const fixedValue = lowerCaseSlugOrId(value, type);
  const article = await dbArticles.articles.where(type).equals(fixedValue).first();
  return article;
};
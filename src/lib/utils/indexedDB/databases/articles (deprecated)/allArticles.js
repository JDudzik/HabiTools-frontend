// Reference: https://dexie.org/docs/API-Reference#quick-reference
import { dbArticles } from './initiateDatabase';


export const allArticles = async () => await dbArticles.articles.toArray();
import DataLoader from "dataloader";
import { iDB } from '../db.interface';

export interface Key {
  postId: number,
  bodyLength: number,
}

export interface Value {
  id: number,
  body: string,
}

export const postsLoader = (db: iDB): any => {
  return new DataLoader<Key, Value>( async (keys: Key[]) => {
    const postIds = keys.map(k => k.postId);
    const bodyLength = keys.reduce((max, k) => k.bodyLength > max ? k.bodyLength : max, 0);
    const posts = await db.getPostsWithBody(postIds, bodyLength);
    const results = keys.map(key => {
      return posts.find(post => post.id === key.postId)
    })
    return results;
  }
)}
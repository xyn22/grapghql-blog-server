import DataLoader from "dataloader";
import { iDB } from '../db.interface';

export const commentsAuthorLoader = (db: iDB): any => {
  return new DataLoader( async (ids: number[]) => {
    const users = await db.getUsers(ids);
    const results = ids.map(id => {
      return users.find(user => user.id === id)
    })
    return results;
  }
)}
import { iDB } from '../db.interface';

export default {
  author: async (comment, __, { loaders, dataSources }: { loaders, dataSources: { db: iDB } }) => {
    const user = await loaders.commentsAuthorLoader.load(comment.userId);
    return {
      id: user.id,
      email: user.email,
    }
  }
}
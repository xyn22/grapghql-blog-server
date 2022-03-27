import { iDB } from '../db.interface';
import { Key } from '../dataLoaders/posts';

export default {
  body: async (post, { size }: { size: string } = { size: 'FULL'}, { loaders, dataSources }: { loaders, dataSources: { db: iDB } }) => {
    const bodyLength: number = size === "EXCERT" ? parseInt(process.env.EXCERT_LENGTH) : 0;
    const key: Key = {
      postId: post.id,
      bodyLength,
    }
    const result = await loaders.postsLoader.load({ postId: post.id, bodyLength });
    return result.body;
  }
}
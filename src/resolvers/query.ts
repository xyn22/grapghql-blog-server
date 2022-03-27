import { iDB } from '../db.interface';

export default {
  posts: async (_, { pageSize, after }, { dataSources }: { dataSources: { db: iDB } }) => {
    const { db } = dataSources;
    const result = await db.getPosts(pageSize, after);
    const posts = result.map(post => {
      const author = {
        id: post.userId,
        email: post.email,
        name: post.name,
      };

      return {
        id: post.id,
        subject: post.subject,
        body: post.body,
        author,
      }
    });

    const cursor = posts.length ? posts[posts.length - 1].id : 0;
    const next = await db.getPosts(1, cursor);
    const hasMore = next.length ? true : false;
    return {
      cursor,
      hasMore,
      posts
    }
  },

  post: async (_,{ id }, { dataSources }: { dataSources: { db: iDB } }) => {
    const { db } = dataSources;
    const post = await db.getPost(id);
    if (!post) {
      return null;
    }
  },

  comments: async (_, { postId, pageSize, after }, { dataSources }: { dataSources: { loaders, db: iDB } }) => {
    const { db } = dataSources;
    const comments = db.getComments(postId, pageSize, after);
    
    const cursor = comments.length ? comments[comments.length - 1].id : 0;
    const next = await db.getComments(postId, 1, cursor);
    console.log({next})
    const hasMore = next.length ? true : false;
    return {
      cursor,
      hasMore,
      comments
    }
  },

  me: async (_, __, { user, dataSources }: { user, dataSources: { db: iDB } }) => {
    const { db } = dataSources;
    const posts = await db.getPostsForUser(user.id)
    return {
      id: user.id,
      email: user.email,
      posts,
    }
  }
}
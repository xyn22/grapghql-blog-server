import { hash, compare } from "bcrypt";
import { iDB } from '../db.interface';
import { signToken } from '../token';

export default {
  addPost: async (_, { subject, body }, { dataSources, user }: { user, dataSources: { db: iDB } }) => {
    const { db } = dataSources;
    try {
      if (!user) {
        return {
          success: false,
          message: "login first",
        }
      }
      const [ id ] = await db.addPost(subject, body, user.id);
      return {
        success: true,
        id,
      }
    } catch (e) {
      console.error(e);
      return {
        success: false,
        message: "could not add post",
      }
    }
  },

  deletePost: async (_, { postId }, { dataSources, user }: { user, dataSources: { db: iDB } }) => {
    const { db } = dataSources;
    try {
      if (!user) {
        return {
          success: false,
          message: "login first",
        }
      }
      const post = await db.getPost(postId);
      if (!post || post.userId !== user.id) {
        return {
          success: false,
          message: "you do not own this post",
        }
      }
      const affected = await db.deletePost(postId);
      if (affected) {
        return {
          success: true,
          id: postId,
          message: "post deleted",
        }
      } else {
        return {
          success: false,
          message: "post not found or cannot be deleted",
          id: postId,
        }
      }
    } catch (e) {
      console.error(e);
      return {
        success: false,
        message: "could not delete post",
      }
    }
  },

  createUser: async(_, { name, email, password}, { dataSources }: { dataSources: { db: iDB } }) => {
    const { db } = dataSources;
    try {
      const hashed = await hash(password, 8);
      const [ userId ] = await db.createUser(name, email, hashed);
      return {
        success: true,
        id: userId,
      }
    } catch (e) {
      console.error(e)
      return {
        success: false,
        message: "failed to create user",
      };
    }
  },

  login: async(_, { email, password}, { dataSources }: { dataSources: { db: iDB } }) => {
    const { db } = dataSources;
    try {
      const hashed = await hash(password, 8);
      const [ user ] = await db.getUserByEmail(email);
      if (!user) {
        return {
          token: null,
          message: "login fails",
        }
      }
      const token = await signToken(user.id.toString());
      const matches = await compare(password, user.password);
      if (matches) {
        return {
          token,
          message: "provide this token in `authorization` header",
        }
      }
      return {
        token: null,
        message: "login fails",
      }
    } catch (e) {
      console.error(e);
    }
  },

  addComment: async (_, { postId, body }, { dataSources, user }: { user, dataSources: { db: iDB } }) => {
    const { db } = dataSources;
    try {
      if (!user) {
        return {
          success: false,
          message: "login first",
        }
      }
      const [ id ] = await db.addComment(postId, user.id, body);
      return {
        success: true,
        id,
      }
    } catch (e) {
      console.error(e);
      return {
        success: false,
        message: "could not add comment",
      }
    }   
  }
}
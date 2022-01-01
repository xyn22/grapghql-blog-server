import { iDB } from './db.interface';
import { verifyToken } from './token';
import { postsLoader } from './dataLoaders/posts';
import { commentsAuthorLoader } from './dataLoaders/commentAuthor';

type Context = {
  user?: any,
  loaders: any,
};

const createContext = (db: iDB) => {
  return async ({ req }) => {
    const auth = (req.headers && req.headers.authorization) || '';
    let context: Context = {
      loaders: {
        postsLoader: postsLoader(db),
        commentsAuthorLoader: commentsAuthorLoader(db),
      }
    };
    if (auth) {
      const userId = await verifyToken(auth);
      if (userId) {
        const [ user ] = await db.getUserById(userId);
        if (user) {
          context.user = user;
        }
      }
    }
    return context;
  };
};

export default createContext;
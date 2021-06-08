export interface iDB {
  getPosts: (pageSize: number, after: string) => any;
  getPostsForUser: (id: number) => any;
  getPost: (id: number) => any;
  getPostsWithBody: (ids: number[], bodyLength: number) => any;
  addPost: (subject: string, body: string, userId: number) => any;
  deletePost: (postId: number) => any;
  createUser: (name: string, email: string, password: string) => any;
  getUserByEmail: (email: string) => any;
  getUsers: (ids: number[]) => any;
  getUserById: (id: number) => any;
  getComments: (postId: number, pageSize: number, after: String) => any;
  addComment: (postId: number, userId: number, body: string) => any;
}

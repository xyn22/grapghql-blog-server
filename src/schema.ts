import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    posts(
      pageSize: Int!
      after: String!
    ): PostConnection!
    comments(
      postId: Int!
      pageSize: Int!
      after: String!
    ): CommentConnection!
    post(id: ID!): Post
    me: User
  }

  type Mutation {
    addPost(subject: String, body: String): PostResponse!
    modifyPost(postId: ID!, subject: String!, body: String!): PostResponse!
    deletePost(postId: ID!): PostResponse!

    addComment(postId: ID!, body: String!): CommentResponse!
    modifyComment(commentId: ID!, body: String!): CommentResponse!
    deleteComment(commentId: ID!): CommentResponse!

    login(email: String, password: String): LoginResponse # login token
    createUser(email: String, password: String, name: String): UserResponse
  }

  type PostResponse {
    success: Boolean!
    message: String
    id: ID
  }

  type CommentResponse {
    success: Boolean!
    message: String
    id: ID
  }

  type UserResponse {
    success: Boolean!
    message: String
    id: ID
  }

  type PostConnection {
    cursor: String!
    hasMore: Boolean!
    posts: [Post]!
  }

  type LoginResponse {
    token: String
    message: String
  }
  type CommentConnection {
    cursor: String!
    hasMore: Boolean!
    comments: [Comment]!
  }

  type Post {
    id: ID!
    subject: String!
    body(size: BodySize): String!
    author: User
  }

  type Comment {
    id: ID!
    postId: ID!
    body: String!
    author: User
  }

  type User {
    id: ID!
    email: String
    posts: [Post]!
  }

  enum BodySize {
    EXCERT
    FULL
  }
`;

export default typeDefs;

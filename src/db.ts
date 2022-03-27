import { SQLDataSource } from "datasource-sql";
import { iDB } from './db.interface';

const MINUTE = 60;

class Database extends SQLDataSource implements iDB  {

  constructor(knexConfig) {
    super(knexConfig);
    this._initializeDB();
  }

  private async _initializeDB() {
    this.knex.schema.hasTable('posts').then((exists) => {
      if (!exists) {
        return this.knex.schema.createTable('posts', (t) => {
          t.increments('id').primary();
          t.string('subject', 100);
          t.text('body');
          t.integer('userId');
        });
      }
    });
    
    this.knex.schema.hasTable('comments').then((exists) => {
      if (!exists) {
        return this.knex.schema.createTable('comments', (t) => {
          t.increments('id').primary();
          t.integer('postId');
          t.text('body');
          t.integer('userId');
        });
      }
    });
    
    this.knex.schema.hasTable('users').then((exists) => {
      if (!exists) {
        return this.knex.schema.createTable('users', (t) => {
          t.increments('id').primary();
          t.string('name', 50);
          t.string('email', 50);
          t.string('password', 20);
        });
      }
    });
  }

  async getPosts(pageSize: number, after: string) {
    return this.knex
      .select(['posts.id', 'subject'])
      .from("posts")
      .innerJoin("users", function() {
        this.on('posts.userId', '=', 'users.id')
      })
      .where('posts.id', '>', after)
      .limit(pageSize)
  }

  async getPostsWithBody(ids: number[], bodyLength: number) {
    return this.knex
      .select([
        'id',
        bodyLength ? this.knex.raw(`SUBSTR(body, 0, ${bodyLength}) AS body`) : 'body'
      ])
      .from("posts")
      .whereIn('id', ids);
  }

  async getPost(id: number) {
    return this.knex('posts').select('*').where({ id }).first();
  }

  async getPostsForUser(userId: number) {
    return this.knex('posts').select('*').where({ userId });
  }

  async addPost(subject: string, body: string, userId: number) {
    return this.knex('posts').insert({
      subject,
      body,
      userId
    });
  }

  async deletePost(id: number) {
    return this.knex('posts').where({ id }).delete();
  }

  async createUser(name: string, email: string, password: string) {
    return this.knex('users').insert({
      name,
      email,
      password,
    });
  }

  async getUserByEmail(email: string) {
    return this.knex('users').select('*').where({ email });
  }

  async getUsers(ids: number[]) {
    return this.knex('users').select('*').whereIn('id', ids);
  }

  async getUserById(id: number) {
    return this.knex('users').select('*').where({ id });
  }

  async getComments(postId: number, pageSize: number, after: String) {
    return this.knex('comments')
    .select('*')
    .where('postId',postId)
    .andWhere('id', '>', after)
    .limit(pageSize)
  }

  async addComment(postId: number, userId: number, body: string) {
    return this.knex('comments').insert({
      postId,
      body,
      userId
    });
  }
}

export default Database;
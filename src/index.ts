import  { ApolloServer } from 'apollo-server';
import dotEnv from 'dotenv';
import knex from "knex";
import resolvers from './resolvers';
import typeDefs from './schema';
import Database from './db';
import createContext from './context';

dotEnv.config();

const knexConfig = knex({
  client: 'sqlite3',
  connection: () => ({
    filename: process.env.SQLITE_FILENAME
  }),
  useNullAsDefault: true,
});

const db = new Database(knexConfig);
const context = createContext(db);

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context,
  dataSources: () => ({ db }),
 });

const port = process.env.PORT;
server.listen(port).then(() => {
  console.log(`running on port ${port}`)
})

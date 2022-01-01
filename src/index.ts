import server from './server';
import express from 'express';
const app = express();
server.applyMiddleware({ app });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`running on port ${port}`)
});

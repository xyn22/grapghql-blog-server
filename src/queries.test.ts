import server from './server';
import supertest from "supertest";
import express from 'express';
const app = express();
server.applyMiddleware({ app });
let request = supertest(app);

const query = `
query{
  posts(pageSize: 2, after: "1") {
    hasMore
    cursor
    posts{
      id
      subject
      body(size: EXCERT)
    }
  }
}
`;

test('fetch posts', (done) => {
  request
    .post("/graphql")
    .send({
      query,
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      console.log(res.body.data);
      if (err) return done(err);
      done();
    });
})
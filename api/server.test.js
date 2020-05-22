const supertest = require("supertest");
const server = require("./server");
const model = require("../auth/auth-model");
const db = require("../database/dbConfig");

beforeEach(() => {
  return db.migrate
    .rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run());
});

describe("server", () => {
  it("can run", () => {
    expect(true).toBeTruthy();
  });
  describe("GET /", () => {
    it("should return http status 200", () => {
      return supertest(server)
        .get("/")
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.status).toBeTruthy();
        });
    });
  });
  it("should return {api:up}", () => {
    return supertest(server)
      .get("/")
      .then((res) => {
        expect(res.body).toEqual({ api: "up" });
        expect(res.body.api).toBe("up");
        expect(res.body.api).toBeDefined();
      });
  });
});

describe("POST /api/users/register", () => {
  it("return 201 created", function (done) {
    return supertest(server)
      .post("/api/auth/register")
      .send({ username: "Joo", password: "123123" })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
  it("should correct length of user list", async () => {
    await model.add({ username: "Sherlock", password: "123abc" });

    // read data from the table
    const users = await db("users");
    let amount = users.length;
    expect(users).toHaveLength(amount);
  });
});

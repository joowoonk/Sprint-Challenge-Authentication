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
  it("6th account created", function (done) {
    return supertest(server)
      .post("/api/auth/register")
      .send({ username: "Nate", password: "123123" })
      .then((res) => {
        // console.log(res.body.user);
        expect(res.body).toMatchObject({ id: 6 });
        expect(res.body.user.id).toBe(6);
        expect(res.body.user).toBeDefined();
      });
  });
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
  it("login works with a correct credentials?", function (done) {
    supertest(server)
      .post("/api/auth/register")
      .send({ username: "Joo", password: "123123" })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
    return supertest(server)
      .post("/api/auth/login")
      .send({ username: "Joo", password: "123123" })
      .expect(200)
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

describe("POST /api/users/login", () => {
  it("login works without a correct credentials?", function (done) {
    return supertest(server)
      .post("/api/auth/login")
      .send({ username: "Who", password: "123123" })
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});

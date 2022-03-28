const request = require("supertest")
const db = require("../data/dbConfig.js")
const server = require("./server.js")


// Write your tests here
// test('sanity', () => {
//   expect(true).toBe(true)
// })
const testUser = {
  "username":"tester",
  "password":"abc123"
}

beforeAll(async ()=>{
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeAll(async ()=>{
  await db("users").truncate()
})

it("registering success",async ()=>{
  let res
  res = await request(server).post("/api/auth/register").send(testUser)
  expect(res.body).toMatchObject({id:1, username:testUser.username})
})

it("username, pass required",async ()=>{
  let res
  res = await request(server).post("/api/auth/register").send(testUser.username)
  expect(res.body).toBe("username and password required")
})

it("login successfull",async ()=>{
  let res
  res = await request(server).post("/api/auth/login").send(testUser)
  expect(res.body).toMatchObject({message:`Welcome, tester`})
})

it("login Unsuccessfull",async ()=>{
  let res
  res = await request(server).post("/api/auth/login").send(testUser.username)
  expect(res.body).toBe("username and password required")
})

it(" access the DAD jokes",async ()=>{
  let res
  res = await request(server).post("/api/auth/login").send(testUser)
  const token = res.body.token
  res = await request(server).get("/api/jokes").set('Authorization', token)
  expect(res.status).toBe(200)
})

it("denied access to the Dad Jokes",async ()=>{
  let res
  res = await request(server).post("/api/auth/login").send(testUser)
  res = await request(server).get("/api/jokes")
  expect(res.body).toBe("token required")
})
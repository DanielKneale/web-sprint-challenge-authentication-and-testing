module.exports = {
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 4,
  JWT_SECRET: process.env.JWT_SECRET || "keepitsecret"
}

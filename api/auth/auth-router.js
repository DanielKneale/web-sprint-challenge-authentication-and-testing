const router = require('express').Router();
const {checkPayLoad, checkUserInDb,checkUserExists} = require("../middleware/middleware")
const bcrypt = require("bcrypt")
const { add, findBy } = require("../users/users-model");
const jwt = require("jsonwebtoken")
const { BCRYPT_ROUNDS, JWT_SECRET } = require('../../config')

function makeToken(user){
    const payload = {
      subject:user.id,
      username: user.username,
    }
    const options = {
      expiresIn:"500s"
    }
    return jwt.sign(payload,JWT_SECRET, options)
}

router.post('/register',checkPayLoad,checkUserInDb, async (req, res) => {
  console.log("register")
  try{
    const hash = bcrypt.hashSync(req.body.password,BCRYPT_ROUNDS)
    const newUser = await add({username:req.body.username,password:hash})
    res.status(201).json(newUser)
  }catch(e){
    res.status(500).json(`Server errpr: ${e.message}`)
  }


  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login',checkPayLoad,checkUserExists, (req, res) => {
  let {username, password} = req.body
  const verified = bcrypt.compareSync(password, req.userData.password) 
  findBy({username})
    .then(([user])=>{
      if(verified){
        const token = makeToken(user)
        res.status(200).json({message:`Welcome, ${req.userData.username}`,token})
      }else{
        res.status(401).json("username or password incorrect")
      }
    })
    .catch()
  

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});


module.exports = router;

const router = require('express').Router();
const {checkPayLoad, checkUserInDb,checkUserExists} = require("../middleware/restricted")
const bcrypt = require("bcrypt")
const { add } = require("../users/users-model");


router.post('/register',checkPayLoad,checkUserInDb, async (req, res) => {
  console.log("register")
  try{
    const hash = bcrypt.hashsync(req.body.password,4)
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
  console.log("register");
  try{
    const verified = bcrypt.compareSync(req.body.password, req.userData.password) 
    if(verified){
      req.session.user = req.userData
      res.json(`Welcome, ${req.userData.username}`)
    }else{
      res.status(401).json("username or password incorrect")
    }
  }catch(e){
    res.status(500).json(`Server errpr: ${e.message}`)
  }
  

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

router.get("/logout",(req,res)=>{
  if(req.session){
      req.session.destroy(err=>{
          if(err){
              res.json("Can't log out")
          }else{
              res.json("Logged out!")
          }
      })
  }else{
      res.json("There was no session")
  }
})

module.exports = router;

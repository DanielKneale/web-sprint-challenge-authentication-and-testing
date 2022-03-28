const { findBy } = require("../users/users-model");



const checkPayLoad = (req,res,next)=>{
  if(!req.body.username || !req.body.password){
    res.status(401).json("username and password required")
  }else{
    next()
  }
}

const checkUserInDb = async (req,res,next)=>{
  try{
    const rows = await findBy({username:req.body.username})
    if(!rows.length){
      next()
    }else{
      res.status(401).json("username already exists")
    }
  }catch(e){
    res.status(500).json(`server error:: ${e.message}`)
  }
}

const checkUserExists = async (req,res,next)=>{
  try{
    const rows = await findBy({username:req.body.username})
    if(rows.length){
      req.userData = rows[0]
      next()
    }else{
      res.status(401).json("Username does not exits")
    }
  }catch(e){
    res.status(500).json(`server error:: ${e.message}`)
  }
}
  
  //  IMPLEMENT

  //  1- On valid token in the Authorization header, call next.

  //  2- On missing token in the Authorization header,
  //    the response body should include a string exactly as follows: "token required".

  //  3- On invalid or expired token in the Authorization header,
  //    the response body should include a string exactly as follows: "token invalid".
  

  module.exports = {
    checkPayLoad,
    checkUserInDb,
    checkUserExists
  };
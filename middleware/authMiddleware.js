const JWT = require("jsonwebtoken");
const ErrorResponse=require("../Utils/errorResponse.js")
const User= require("../Models/user.js")

const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    next("Authentication== failed");
  }

  const token = authHeader?.split(" ")[1];

  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET);

    req.body.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    console.log(error);
    next("Authentication failed");
  }
};
const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return next(new ErrorResponse("Authentication failed", 401));
    }

    const token = authHeader.split(" ")[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    if (user.role !== 1) {
      return next(new ErrorResponse("Not authorized to access this route", 403));
    }

    // If the user is an admin
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse("Authentication failed", 401));
  }
};



const isAuthenticated= async (req,res,next)=>{

  const {token} = req.cookies;


  if(!token){

      return next(new ErrorResponse('Not authorized to access this route', 401))
  }

  try{

      const decoded= JWT.verify(token, process.env.JWT_SECRET);
      req.user= await User.findById(decoded.id);
      next();

  }catch(error){
      return next(new ErrorResponse('Not authorized to access this route', 401))



  }



}


module.exports = {
  userAuth,
  isAdmin,
  isAuthenticated
};
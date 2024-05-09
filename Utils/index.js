const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const hashString = async (useValue) => {


  const salt = await bcrypt.genSalt(10);
  console.log("ssssss",salt)
  const hashedpassword = await bcrypt.hash(useValue, "$2b$10$lF/jGzoe2QA1D9LKFRruvO");
  return hashedpassword;
};  

const CompareString = async (userPassword, password) => {
  const isMatch = await bcrypt.compare(userPassword, password);
  return isMatch;
};

function createJwt(id) {
  return JWT.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

module.exports = {
  hashString,
  CompareString,
  createJwt,
};
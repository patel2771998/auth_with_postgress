const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];


  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, 'sample_app', (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.accountId = !!decoded.id_account ? decoded.id_account : 0
    req.userId = decoded.id;
    req.token = token
    next();
  });
};



const authJwt = {
  verifyToken: verifyToken
};
module.exports = authJwt;

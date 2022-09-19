import jwt from "jsonwebtoken";
import "dotenv/config"

const getDecodedToken = (request, response) => {
    
    const authorization = request.get('Authorization');
    let token = ""
  
    if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
      token = authorization.substring(7)
   }
    const decodeToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

    return decodeToken;
    
}

export {getDecodedToken}
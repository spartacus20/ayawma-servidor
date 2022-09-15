import jwt from "jsonwebtoken";
export const getAuthorization = (request, response) => {
    
    const authorization = request.get('Authorization'); 
    const token = null; 
    if(authorization && authorization.toLocaleLowerCase().startsWith("bearer")){
        token = authorization.substring(7);
    }
    const decodeToken = jwt.verify(token, "12333") // TODO: change token verifier. 
    if(!token || !decodeToken) {
        return response.status(401).json{
            error: "token missing or  invalid"
        }
    }
}